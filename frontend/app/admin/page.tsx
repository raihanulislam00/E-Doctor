"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type ApiMessage = {
  type: "success" | "error" | "info";
  text: string;
};

type PendingDoctor = {
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
  licenseImageUrl?: string;
  doctorImageUrl?: string;
  nidNumber: string;
  createdAt: string;
};

export default function AdminPortal() {
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    [],
  );

  const [mainAdminForm, setMainAdminForm] = useState({
    adminId: "",
    name: "",
    nidNumber: "",
    address: "",
    password: "",
  });
  const [adminForm, setAdminForm] = useState({
    adminId: "",
    name: "",
    nidNumber: "",
    address: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({ adminId: "", password: "" });
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<ApiMessage | null>(null);
  const [pending, setPending] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(false);

  const updateMainAdmin = (field: string, value: string) => {
    setMainAdminForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateAdmin = (field: string, value: string) => {
    setAdminForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setToken(localStorage.getItem("adminToken"));
  }, []);

  const updateLogin = (field: string, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMainRegister = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${apiBase}/admin/register-main`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mainAdminForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Main admin creation failed");
      }
      setMessage({ type: "success", text: "Main admin created." });
      setMainAdminForm({ adminId: "", name: "", nidNumber: "", address: "", password: "" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Main admin creation failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${apiBase}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      localStorage.setItem("adminToken", data.access_token);
      setToken(data.access_token);
      setMessage({ type: "success", text: "Admin login successful." });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      setMessage({ type: "error", text: "Please login as main admin first." });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${apiBase}/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Admin creation failed");
      }
      setMessage({ type: "success", text: "Admin created successfully." });
      setAdminForm({ adminId: "", name: "", nidNumber: "", address: "", password: "" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Admin creation failed" });
    } finally {
      setLoading(false);
    }
  };

  const loadPending = async () => {
    if (!token) {
      setMessage({ type: "error", text: "Login required to load pending doctors." });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${apiBase}/doctor/pending-registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load pending doctors" );
      }
      setPending(data);
      setMessage({ type: "success", text: "Pending list updated." });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to load pending doctors" });
    } finally {
      setLoading(false);
    }
  };

  const verifyDoctor = async (doctorId: string, action: "approve" | "reject") => {
    if (!token) {
      setMessage({ type: "error", text: "Login required to verify doctors." });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${apiBase}/doctor/verify-registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doctorId, action }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }
      setMessage({ type: "success", text: data.message || "Doctor updated" });
      setPending((prev) => prev.filter((doc) => doc.id !== doctorId));
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Verification failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setMessage({ type: "info", text: "Logged out." });
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">Admin console</p>
          <h1 className="display text-3xl text-[var(--ink)]">Admin verification desk</h1>
        </div>
        <a
          className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold text-[var(--slate)]"
          href="/"
        >
          Back to home
        </a>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="surface rounded-[28px] p-6 md:p-8">
          <h2 className="display text-2xl">Main admin setup</h2>
          <p className="mt-2 text-sm text-[var(--slate)]">
            Create the first main admin once. This account can create other admins.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={handleMainRegister}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Main admin ID"
                value={mainAdminForm.adminId}
                onChange={(event) => updateMainAdmin("adminId", event.target.value)}
                required
              />
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Full name"
                value={mainAdminForm.name}
                onChange={(event) => updateMainAdmin("name", event.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="NID number"
                value={mainAdminForm.nidNumber}
                onChange={(event) => updateMainAdmin("nidNumber", event.target.value)}
                required
              />
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Address"
                value={mainAdminForm.address}
                onChange={(event) => updateMainAdmin("address", event.target.value)}
                required
              />
            </div>
            <input
              className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
              placeholder="Password"
              type="password"
              value={mainAdminForm.password}
              onChange={(event) => updateMainAdmin("password", event.target.value)}
              required
            />
            <button
              className="rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create main admin"}
            </button>
          </form>
        </section>

        <section className="flex flex-col gap-6">
          <div className="glass rounded-[24px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="display text-xl">Admin login</h2>
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
            <form className="mt-4 grid gap-3" onSubmit={handleLogin}>
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Admin ID"
                value={loginForm.adminId}
                onChange={(event) => updateLogin("adminId", event.target.value)}
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
            <h2 className="display text-xl">Create other admins</h2>
            <p className="mt-2 text-sm text-[var(--slate)]">
              Main admin can create new admin accounts with unique IDs.
            </p>
            <form className="mt-4 grid gap-3" onSubmit={handleCreateAdmin}>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                  placeholder="Admin ID"
                  value={adminForm.adminId}
                  onChange={(event) => updateAdmin("adminId", event.target.value)}
                  required
                />
                <input
                  className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                  placeholder="Full name"
                  value={adminForm.name}
                  onChange={(event) => updateAdmin("name", event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                  placeholder="NID number"
                  value={adminForm.nidNumber}
                  onChange={(event) => updateAdmin("nidNumber", event.target.value)}
                  required
                />
                <input
                  className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                  placeholder="Address"
                  value={adminForm.address}
                  onChange={(event) => updateAdmin("address", event.target.value)}
                  required
                />
              </div>
              <input
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                placeholder="Password"
                type="password"
                value={adminForm.password}
                onChange={(event) => updateAdmin("password", event.target.value)}
                required
              />
              <button
                className="rounded-full border border-black/10 bg-white/70 px-5 py-2 text-sm font-semibold text-[var(--slate)]"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create admin"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="glass rounded-[28px] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">Verification queue</p>
              <h2 className="display text-2xl">Pending doctor registrations</h2>
            </div>
            <button
              className="rounded-full bg-[var(--teal)] px-5 py-2 text-sm font-semibold text-white"
              type="button"
              onClick={loadPending}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh pending list"}
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            {pending.length === 0 ? (
              <p className="text-sm text-[var(--slate)]">No pending doctors loaded.</p>
            ) : (
              pending.map((doctor) => (
                <div key={doctor.id} className="rounded-2xl border border-black/10 bg-white/80 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">{doctor.name}</p>
                      <p className="text-xs text-[var(--slate)]">{doctor.email} • {doctor.phoneNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                        type="button"
                        onClick={() => verifyDoctor(doctor.id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                        type="button"
                        onClick={() => verifyDoctor(doctor.id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-[var(--slate)] sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Specialization:</span> {doctor.specialization}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Experience:</span> {doctor.experienceYear} years
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Hospital:</span> {doctor.hospitalName}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">NID:</span> {doctor.nidNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Qualification:</span> {doctor.qualification}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Medical license:</span> {doctor.medicalLicenseNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">License number:</span> {doctor.licenseNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">License image:</span> {doctor.licenseImageUrl || "Not provided"}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Doctor photo:</span> {doctor.doctorImageUrl || "Not provided"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {message ? (
        <div className="mx-auto mb-10 w-full max-w-6xl px-6">
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
        </div>
      ) : null}
    </div>
  );
}
