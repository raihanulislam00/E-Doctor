# 🚀 Quick Start Guide - Doctor Registration & Login API

## ⚡ 5-Minute Setup

### Step 1: Install & Run
```bash
cd /Users/raihanulislamnahid/Documents/Project/E-Doctor/backend

# Create uploads directory
mkdir -p uploads/doctors

# Install dependencies (already done)
npm install

# Start development server
npm run start:dev
```

You should see:
```
Application is running on: http://localhost:3000
```

---

## 📝 Test the API (Using cURL or Postman)

### Test 1: Doctor Registration
```bash
# Create test image files first (or use any JPG/PNG)
touch test_license.jpg test_doctor.jpg

# Register doctor
curl -X POST http://localhost:3000/doctor/register \
  -F "name=Dr. Ahmed Khan" \
  -F "phoneNumber=+8801812345678" \
  -F "email=ahmed@hospital.com" \
  -F "specialization=Cardiology" \
  -F "qualification=MBBS, MD Cardiology" \
  -F "experienceYear=8" \
  -F "hospitalName=Apollo Hospital" \
  -F "medicalLicenseNumber=ML-2024-001" \
  -F "licenseNumber=LN-2024-001" \
  -F "nidNumber=9876543210123" \
  -F "password=SecurePass@123" \
  -F "licenseImage=@test_license.jpg" \
  -F "doctorImage=@test_doctor.jpg"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please wait for admin verification.",
  "doctor": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "ahmed@hospital.com",
    "name": "Dr. Ahmed Khan",
    "verificationStatus": "pending"
  }
}
```

**Save the doctor ID for next steps!**

---

### Test 2: Get Pending Registrations (Admin)
```bash
curl -X GET http://localhost:3000/doctor/pending-registrations \
  -H "Authorization: Bearer <admin_access_token>"
```

**Expected Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Dr. Ahmed Khan",
    "email": "ahmed@hospital.com",
    "phoneNumber": "+8801812345678",
    "specialization": "Cardiology",
    "qualification": "MBBS, MD Cardiology",
    "experienceYear": 8,
    "hospitalName": "Apollo Hospital",
    "medicalLicenseNumber": "ML-2024-001",
    "licenseNumber": "LN-2024-001",
    "licenseImageUrl": "uploads/doctors/abc123.jpg",
    "doctorImageUrl": "uploads/doctors/xyz789.jpg",
    "nidNumber": "9876543210123",
    "createdAt": "2024-06-02T15:30:00.000Z"
  }
]
```

---

### Test 3: Admin Approves Doctor
```bash
curl -X POST http://localhost:3000/doctor/verify-registration \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_access_token>" \
  -d '{
    "doctorId": "550e8400-e29b-41d4-a716-446655440000",
    "action": "approve"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Doctor approved successfully",
  "doctor": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Dr. Ahmed Khan",
    "email": "ahmed@hospital.com",
    "verificationStatus": "approved"
  }
}
```

---

### Test 4: Doctor Login
```bash
curl -X POST http://localhost:3000/doctor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@hospital.com",
    "password": "SecurePass@123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiYWhtZWRAaG9zcGl0YWwuY29tIiwibmFtZSI6IkRyLiBBaG1lZCBLaGFuIiwiaWF0IjoxNzE3MzI1MDAwLCJleHAiOjE3MTc0MTE0MDB9.xyz...",
  "doctor": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Dr. Ahmed Khan",
    "email": "ahmed@hospital.com",
    "specialization": "Cardiology"
  }
}
```

**Save the access_token!**

---

### Test 5: Get Doctor Profile (With Authentication)
```bash
curl -X GET http://localhost:3000/doctor/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiYWhtZWRAaG9zcGl0YWwuY29tIiwibmFtZSI6IkRyLiBBaG1lZCBLaGFuIiwiaWF0IjoxNzE3MzI1MDAwLCJleHAiOjE3MTc0MTE0MDB9.xyz..."
```

**Expected Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Dr. Ahmed Khan",
  "email": "ahmed@hospital.com",
  "phoneNumber": "+8801812345678",
  "specialization": "Cardiology",
  "qualification": "MBBS, MD Cardiology",
  "experienceYear": 8,
  "hospitalName": "Apollo Hospital",
  "medicalLicenseNumber": "ML-2024-001",
  "licenseNumber": "LN-2024-001",
  "licenseImageUrl": "uploads/doctors/abc123.jpg",
  "doctorImageUrl": "uploads/doctors/xyz789.jpg",
  "verificationStatus": "approved",
  "createdAt": "2024-06-02T15:30:00.000Z"
}
```

---

## ✨ Key Points

✅ **Registration Status:** Starts as "pending"  
✅ **Admin Approval:** Must approve before doctor can login  
✅ **Login:** Only works if status is "approved"  
✅ **JWT Token:** Valid for 24 hours  
✅ **Password:** Must contain uppercase, lowercase, number, special char  
✅ **Files:** Automatically saved to `uploads/doctors/`  

---

## 🔑 Password Examples

### ✅ Valid Passwords
- `SecurePass@123`
- `MyPassword!456`
- `Doc@2024Secure`
- `A1b2C3d4!`

### ❌ Invalid Passwords
- `password123` (no uppercase, no special char)
- `Pass@12` (too short)
- `PASSWORD123!` (no lowercase)
- `password!@#` (no number)

---

## 📱 Using Postman

1. **Import Collection:**
   - Download `E-Doctor-API.postman_collection.json`
   - Import into Postman
   - Ready to use all 5 endpoints

2. **Set Variables:**
   - After login, copy `access_token`
   - Set in Postman: `Variables` → `access_token`
   - Use `{{access_token}}` in profile request

---

## 🆘 Troubleshooting

### Port 3000 in use?
```bash
lsof -ti:3000 | xargs kill -9
```

### No uploads directory?
```bash
mkdir -p uploads/doctors
```

### Build errors?
```bash
npm run build
```

### Database issues?
```bash
rm database.db
npm run start:dev
```

---

## 📚 Full Documentation

- **Setup Guide:** `SETUP_GUIDE.md`
- **API Docs:** `DOCTOR_API_DOCS.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`
- **Postman Collection:** `E-Doctor-API.postman_collection.json`

---

## ✅ Checklist

- [ ] Dependencies installed
- [ ] Uploads directory created
- [ ] Server running on port 3000
- [ ] Doctor registered
- [ ] Admin approved registration
- [ ] Doctor logged in successfully
- [ ] Profile accessed with token

---

**You're all set! 🎉 Happy coding!**
