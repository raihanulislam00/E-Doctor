"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type ApiMessage = {
  type: "success" | "error" | "info";
  text: string;
};

type DoctorProfile = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  qualification: string;
  experienceYear: number;
  hospitalName: string;
  medicalLicenseNumber: string;
  licenseNumber: string;
  licenseImageUrl?: string | null;
  doctorImageUrl?: string | null;
  verificationStatus: string;
  createdAt: string;
};

const defaultRegister = {
  name: "",
  phoneNumber: "",
  email: "",
  specialization: "",
  qualification: "",
  experienceYear: "",
  hospitalName: "",
  medicalLicenseNumber: "",
  licenseNumber: "",
  nidNumber: "",
  password: "",
};

export default function DoctorPortal() {
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    [],
  );

  const [registerForm, setRegisterForm] = useState(defaultRegister);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [doctorFile, setDoctorFile] = useState<File | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<ApiMessage | null>(null);
  const [loading, setLoading] = useState(false);

  const updateRegister = (field: string, value: string) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setToken(localStorage.getItem("doctorToken"));
  }, []);

  const updateLogin = (field: string, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!licenseFile || !doctorFile) {
      setMessage({ type: "error", text: "Please upload both license and doctor images." });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(registerForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("licenseImage", licenseFile);
    formData.append("doctorImage", doctorFile);

    try {
      const response = await fetch(`${apiBase}/doctor/register`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        const errorText = Array.isArray(data.message) ? data.message.join(", ") : data.message;
        throw new Error(errorText || "Registration failed");
      }

      setMessage({ type: "success", text: data.message || "Registration submitted" });
      setRegisterForm(defaultRegister);
      setLicenseFile(null);
      setDoctorFile(null);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${apiBase}/doctor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("doctorToken", data.access_token);
      setToken(data.access_token);
      setMessage({ type: "success", text: "Login successful" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = async () => {
    if (!token) {
      setMessage({ type: "error", text: "Please login first." });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${apiBase}/doctor/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }
      setProfile(data);
      setMessage({ type: "success", text: "Profile loaded" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Profile load failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    setToken(null);
    setProfile(null);
    setMessage({ type: "info", text: "Logged out." });
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">Doctor portal</p>
          <h1 className="display text-3xl text-[var(--ink)]">Doctor onboarding</h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold text-[var(--slate)]"
            href="/"
          >
            Back to home
          </a>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="surface rounded-[28px] p-6 md:p-8">
          <h2 className="display text-2xl">Register as a doctor</h2>
          <p className="mt-2 text-sm text-[var(--slate)]">
            Upload your license and profile photo. Admin verification is required before login.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleRegister}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Doctor name"
                value={registerForm.name}
                onChange={(event) => updateRegister("name", event.target.value)}
                required
              />
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Phone number"
                value={registerForm.phoneNumber}
                onChange={(event) => updateRegister("phoneNumber", event.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Email"
                type="email"
                value={registerForm.email}
                onChange={(event) => updateRegister("email", event.target.value)}
                required
              />
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Specialization"
                value={registerForm.specialization}
                onChange={(event) => updateRegister("specialization", event.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Qualification"
                value={registerForm.qualification}
                onChange={(event) => updateRegister("qualification", event.target.value)}
                required
              />
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Experience year"
                type="number"
                min={0}
                value={registerForm.experienceYear}
                onChange={(event) => updateRegister("experienceYear", event.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Hospital name"
                value={registerForm.hospitalName}
                onChange={(event) => updateRegister("hospitalName", event.target.value)}
                required
              />
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Medical license number"
                value={registerForm.medicalLicenseNumber}
                onChange={(event) => updateRegister("medicalLicenseNumber", event.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="License number"
                value={registerForm.licenseNumber}
                onChange={(event) => updateRegister("licenseNumber", event.target.value)}
                required
              />
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="NID number"
                value={registerForm.nidNumber}
                onChange={(event) => updateRegister("nidNumber", event.target.value)}
                required
              />
            </div>
            <input
              className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
              placeholder="Password"
              type="password"
              value={registerForm.password}
              onChange={(event) => updateRegister("password", event.target.value)}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="rounded-2xl border border-dashed border-black/20 bg-white/60 px-4 py-3 text-sm">
                <span className="text-[var(--slate)]">Upload license image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs"
                  onChange={(event) => setLicenseFile(event.target.files?.[0] ?? null)}
                  required
                />
              </label>
              <label className="rounded-2xl border border-dashed border-black/20 bg-white/60 px-4 py-3 text-sm">
                <span className="text-[var(--slate)]">Upload doctor photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs"
                  onChange={(event) => setDoctorFile(event.target.files?.[0] ?? null)}
                  required
                />
              </label>
            </div>

            <button
              className="mt-2 rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-0.5"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit registration"}
            </button>
          </form>
        </section>

        <section className="flex flex-col gap-6">
          <div className="glass rounded-[24px] p-6">
            <h2 className="display text-xl">Doctor login</h2>
            <p className="mt-2 text-sm text-[var(--slate)]">
              Use your verified account credentials to access your profile.
            </p>
            <form className="mt-4 grid gap-3" onSubmit={handleLogin}>
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Email"
                type="email"
                value={loginForm.email}
                onChange={(event) => updateLogin("email", event.target.value)}
                required
              />
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Password"
                type="password"
                value={loginForm.password}
                onChange={(event) => updateLogin("password", event.target.value)}
                required
              />
              <button
                className="rounded-full bg-[var(--sun)] px-5 py-2 text-sm font-semibold text-[var(--ink)]"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>

          <div className="surface rounded-[24px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="display text-xl">Doctor profile</h2>
              {token ? (
                <button
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)]"
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-[var(--slate)]">
              Load your profile to confirm approval status and saved data.
            </p>
            <button
              className="mt-4 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold text-[var(--slate)]"
              type="button"
              onClick={handleProfile}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load profile"}
            </button>

            {profile ? (
              <div className="mt-4 grid gap-2 text-sm text-[var(--slate)]">
                <p>
                  <span className="font-semibold text-[var(--ink)]">Name:</span> {profile.name}
                </p>
                <p>
                  <span className="font-semibold text-[var(--ink)]">Email:</span> {profile.email}
                </p>
                <p>
                  <span className="font-semibold text-[var(--ink)]">Specialization:</span> {profile.specialization}
                </p>
                <p>
                  <span className="font-semibold text-[var(--ink)]">Status:</span> {profile.verificationStatus}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-xs text-[var(--slate)]">No profile loaded yet.</p>
            )}
          </div>

          {message ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm ${
                message.type === "error"
                  ? "bg-red-100 text-red-800"
                  : message.type === "success"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
              }`}
            >
              {message.text}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
