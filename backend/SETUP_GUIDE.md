# Doctor Registration & Login System - Setup Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation & Setup](#installation--setup)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Testing Guide](#testing-guide)
7. [Features](#features)
8. [Error Handling](#error-handling)

---

## 🎯 Project Overview

This is a **Doctor Registration & Login System** built with NestJS that includes:
- Doctor registration with admin verification workflow
- Secure JWT-based authentication
- File upload support (Medical License & Doctor Profile Images)
- Strong password validation
- TypeORM database integration
- Comprehensive error handling

### Registration Workflow
```
Doctor Registration → System Validation → Pending Status 
→ Admin Reviews → Admin Approves/Rejects 
→ If Approved: Doctor Can Login
→ If Rejected: Doctor Must Re-register
```

---

## 🔧 Prerequisites

- **Node.js** >= 16.x
- **npm** >= 8.x
- **SQLite3** (for database)
- **Postman** or **cURL** (for API testing)

---

## 📦 Installation & Setup

### Step 1: Install Dependencies
```bash
cd /Users/raihanulislamnahid/Documents/Project/E-Doctor/backend
npm install
```

### Step 2: Create Environment File
Create `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

### Step 3: Create Uploads Directory
```bash
mkdir -p uploads/doctors
```

### Step 4: Build the Project
```bash
npm run build
```

### Step 5: Run Development Server
```bash
npm run start:dev
```

You should see:
```
Application is running on: http://localhost:3000
```

---

## 🔌 API Endpoints

### Base URL: `http://localhost:3000/doctor`

### 1️⃣ Register Doctor
**Endpoint:** `POST /doctor/register`

**Request Type:** `multipart/form-data`

**Form Fields:**
```
- name (string): Doctor's full name
- phoneNumber (string): International format (+8801712345678)
- email (string): Valid email address
- specialization (string): Medical specialization
- qualification (string): Medical qualifications
- experienceYear (number): Years of experience (0-70)
- hospitalName (string): Primary hospital name
- medicalLicenseNumber (string): Medical license number
- licenseNumber (string): License number
- nidNumber (string): National ID number
- password (string): Strong password
- licenseImage (file): Medical license image (JPEG/PNG, max 5MB)
- doctorImage (file): Doctor profile picture (JPEG/PNG, max 5MB)
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/doctor/register \
  -F "name=Dr. John Doe" \
  -F "phoneNumber=+8801712345678" \
  -F "email=doctor@example.com" \
  -F "specialization=Cardiology" \
  -F "qualification=MBBS, MD" \
  -F "experienceYear=5" \
  -F "hospitalName=City Hospital" \
  -F "medicalLicenseNumber=ML12345" \
  -F "licenseNumber=LN12345" \
  -F "nidNumber=1234567890123" \
  -F "password=SecurePass@123" \
  -F "licenseImage=@/path/to/license.jpg" \
  -F "doctorImage=@/path/to/doctor.jpg"
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful! Please wait for admin verification.",
  "doctor": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "doctor@example.com",
    "name": "Dr. John Doe",
    "verificationStatus": "pending"
  }
}
```

---

### 2️⃣ Login Doctor
**Endpoint:** `POST /doctor/login`

**Request Type:** `application/json`

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "SecurePass@123"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/doctor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "SecurePass@123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiZG9jdG9yQGV4YW1wbGUuY29tIiwibmFtZSI6IkRyLiBKb2huIERvZSIsImlhdCI6MTcxNzMyNTAwMCwiZXhwIjoxNzE3NDExNDAwfQ.xyz...",
  "doctor": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Dr. John Doe",
    "email": "doctor@example.com",
    "specialization": "Cardiology"
  }
}
```

**Error Cases:**
- Not verified yet: `Your account is pending. Please wait for admin approval.`
- Rejected: `Your account is rejected. Please contact admin.`
- Invalid credentials: `Invalid email or password`

---

### 3️⃣ Get Doctor Profile
**Endpoint:** `GET /doctor/profile`

**Authentication:** Required (JWT Bearer Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Example cURL:**
```bash
curl -X GET http://localhost:3000/doctor/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Dr. John Doe",
  "email": "doctor@example.com",
  "phoneNumber": "+8801712345678",
  "specialization": "Cardiology",
  "qualification": "MBBS, MD",
  "experienceYear": 5,
  "hospitalName": "City Hospital",
  "medicalLicenseNumber": "ML12345",
  "licenseNumber": "LN12345",
  "licenseImageUrl": "uploads/doctors/abc123def456.jpg",
  "doctorImageUrl": "uploads/doctors/xyz789uvw012.jpg",
  "verificationStatus": "approved",
  "createdAt": "2024-06-02T10:30:00.000Z"
}
```

---

### 4️⃣ Get Pending Registrations (Admin)
**Endpoint:** `GET /doctor/pending-registrations`

**Example cURL:**
```bash
curl -X GET http://localhost:3000/doctor/pending-registrations
```

**Success Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Dr. John Doe",
    "email": "doctor@example.com",
    "phoneNumber": "+8801712345678",
    "specialization": "Cardiology",
    "qualification": "MBBS, MD",
    "experienceYear": 5,
    "hospitalName": "City Hospital",
    "medicalLicenseNumber": "ML12345",
    "licenseNumber": "LN12345",
    "licenseImageUrl": "uploads/doctors/abc123def456.jpg",
    "doctorImageUrl": "uploads/doctors/xyz789uvw012.jpg",
    "nidNumber": "1234567890123",
    "createdAt": "2024-06-02T10:30:00.000Z"
  }
]
```

---

### 5️⃣ Verify Doctor Registration (Admin)
**Endpoint:** `POST /doctor/verify-registration`

**Request Type:** `application/json`

**Request Body:**
```json
{
  "doctorId": "550e8400-e29b-41d4-a716-446655440000",
  "action": "approve"
}
```

**Valid Actions:**
- `approve` - Approve the registration
- `reject` - Reject the registration

**Example cURL:**
```bash
curl -X POST http://localhost:3000/doctor/verify-registration \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "550e8400-e29b-41d4-a716-446655440000",
    "action": "approve"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Doctor approved successfully",
  "doctor": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Dr. John Doe",
    "email": "doctor@example.com",
    "verificationStatus": "approved"
  }
}
```

---

## 📊 Database Schema

### Doctors Table
```sql
CREATE TABLE doctors (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  phoneNumber VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL (hashed with bcrypt),
  specialization VARCHAR NOT NULL,
  qualification VARCHAR NOT NULL,
  experienceYear INTEGER NOT NULL,
  hospitalName VARCHAR NOT NULL,
  medicalLicenseNumber VARCHAR NOT NULL,
  licenseNumber VARCHAR NOT NULL,
  licenseImageUrl VARCHAR,
  doctorImageUrl VARCHAR,
  nidNumber VARCHAR NOT NULL UNIQUE,
  verificationStatus ENUM ('pending', 'approved', 'rejected'),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🧪 Testing Guide

### Using Postman

#### 1. Register Doctor
1. Open Postman
2. Create new `POST` request to `http://localhost:3000/doctor/register`
3. Select `Body` → `form-data`
4. Add fields:
   - `name` (text): Dr. John Doe
   - `phoneNumber` (text): +8801712345678
   - `email` (text): doctor@example.com
   - `specialization` (text): Cardiology
   - `qualification` (text): MBBS, MD
   - `experienceYear` (text): 5
   - `hospitalName` (text): City Hospital
   - `medicalLicenseNumber` (text): ML12345
   - `licenseNumber` (text): LN12345
   - `nidNumber` (text): 1234567890123
   - `password` (text): SecurePass@123
   - `licenseImage` (file): Select image file
   - `doctorImage` (file): Select image file
5. Click `Send`

#### 2. Admin Verifies Doctor
1. Create new `POST` request to `http://localhost:3000/doctor/verify-registration`
2. Select `Body` → `raw` → `JSON`
3. Enter JSON:
```json
{
  "doctorId": "550e8400-e29b-41d4-a716-446655440000",
  "action": "approve"
}
```
4. Click `Send`

#### 3. Doctor Logs In
1. Create new `POST` request to `http://localhost:3000/doctor/login`
2. Select `Body` → `raw` → `JSON`
3. Enter JSON:
```json
{
  "email": "doctor@example.com",
  "password": "SecurePass@123"
}
```
4. Click `Send`
5. Copy the `access_token` from response

#### 4. Doctor Accesses Profile
1. Create new `GET` request to `http://localhost:3000/doctor/profile`
2. Go to `Headers` tab
3. Add header:
   - Key: `Authorization`
   - Value: `Bearer <paste_access_token_here>`
4. Click `Send`

---

## ✨ Features

### Security Features
✅ Password hashing with bcrypt (salt rounds: 10)
✅ JWT token-based authentication (24-hour expiration)
✅ Email and NID uniqueness validation
✅ Strong password requirements

### Registration Requirements
✅ 11 required fields
✅ 2 file uploads (images)
✅ Admin verification workflow
✅ Automatic password hashing

### Validation Rules
✅ Email: Valid email format
✅ Phone: International format (+code)
✅ Password: Min 8 chars, uppercase, lowercase, number, special char
✅ Experience: 0-70 years
✅ Files: JPEG/PNG only, max 5MB each
✅ Unique constraints: email, phoneNumber, nidNumber

### File Upload
✅ Automatic file storage in `uploads/doctors/`
✅ Random file naming to prevent conflicts
✅ Image format validation
✅ File size limits (5MB per file)

---

## ❌ Error Handling

### 400 - Bad Request
```json
{
  "statusCode": 400,
  "message": ["password must contain at least one special character"],
  "error": "Bad Request"
}
```

### 401 - Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

### 404 - Not Found
```json
{
  "statusCode": 404,
  "message": "Doctor not found",
  "error": "Not Found"
}
```

### 409 - Conflict
```json
{
  "statusCode": 409,
  "message": "Doctor with this email, phone number, or NID already exists",
  "error": "Conflict"
}
```

### 500 - Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── doctor/
│   │   ├── dto/
│   │   │   ├── register-doctor.dto.ts
│   │   │   ├── login-doctor.dto.ts
│   │   │   └── verify-doctor.dto.ts
│   │   ├── entities/
│   │   │   └── doctor.entity.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── doctor.controller.ts
│   │   ├── doctor.service.ts
│   │   └── doctor.module.ts
│   ├── admin/
│   ├── app.module.ts
│   ├── main.ts
├── test/
├── uploads/
│   └── doctors/
├── .env
├── package.json
└── tsconfig.json
```

---

## 🚀 Next Steps

1. Set up Admin authentication separately
2. Add email verification during registration
3. Implement password reset functionality
4. Add doctor search and filtering
5. Create patient-doctor appointment system
6. Add dashboard for admin and doctors

---

## 💡 Troubleshooting

### Port already in use
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9
# Or change PORT in .env
```

### Database locked error
```bash
# Delete database and restart
rm database.db
npm run start:dev
```

### File upload not working
```bash
# Create uploads directory
mkdir -p uploads/doctors
```

### JWT token invalid
- Make sure you're using Bearer token format: `Bearer <token>`
- Token expires in 24 hours
- Update JWT_SECRET in .env if needed

---

## 📧 Support

For issues or questions, refer to:
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Passport.js Documentation](https://www.passportjs.org)

---

## 📝 License

Proprietary - E-Doctor System
