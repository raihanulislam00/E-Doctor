# Doctor Registration & Login API Documentation

## Overview
This API provides comprehensive Doctor registration with admin verification and JWT-based authentication.

## Features
- ✅ Doctor Registration with file uploads (License Image & Doctor Image)
- ✅ Strong password validation (uppercase, lowercase, numbers, special chars)
- ✅ Admin verification system
- ✅ JWT Authentication
- ✅ Doctor Profile management

## Base URL
```
http://localhost:3000/doctor
```

## Endpoints

### 1. Doctor Registration
**POST** `/doctor/register`

**Description:** Register a new doctor (pending admin verification)

**Request Body (multipart/form-data):**
```json
{
  "name": "Dr. John Doe",
  "phoneNumber": "+8801712345678",
  "email": "doctor@example.com",
  "specialization": "Cardiology",
  "qualification": "MBBS, MD",
  "experienceYear": 5,
  "hospitalName": "City Hospital",
  "medicalLicenseNumber": "ML12345",
  "licenseNumber": "LN12345",
  "nidNumber": "1234567890123",
  "password": "SecurePass@123"
}
```

**Files Required:**
- `licenseImage` (image/jpeg, image/png) - Medical License Image
- `doctorImage` (image/jpeg, image/png) - Doctor Profile Picture

**Max File Size:** 5MB each

**Response:**
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

**Validation Rules:**
- Email: Must be valid email format
- Phone: International format (+code followed by digits)
- Password: Min 8 chars, must contain uppercase, lowercase, number, and special character
- Experience Year: 0-70 years
- All fields are required

---

### 2. Doctor Login
**POST** `/doctor/login`

**Description:** Login with email and password (only for verified doctors)

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "SecurePass@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "doctor": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Dr. John Doe",
    "email": "doctor@example.com",
    "specialization": "Cardiology"
  }
}
```

**Error Cases:**
- Doctor not found: `Invalid email or password`
- Doctor pending verification: `Your account is pending. Please wait for admin approval.`
- Doctor rejected: `Your account is rejected. Please contact admin.`
- Invalid password: `Invalid email or password`

---

### 3. Get Doctor Profile
**GET** `/doctor/profile`

**Description:** Get logged-in doctor's profile (requires JWT authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
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
  "licenseImageUrl": "uploads/doctors/randomname.jpg",
  "doctorImageUrl": "uploads/doctors/randomname.jpg",
  "verificationStatus": "approved",
  "createdAt": "2024-06-02T10:30:00.000Z"
}
```

---

### 4. Get Pending Doctor Registrations (Admin)
**GET** `/doctor/pending-registrations`

**Description:** Get all doctors pending admin verification

**Response:**
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
    "licenseImageUrl": "uploads/doctors/randomname.jpg",
    "doctorImageUrl": "uploads/doctors/randomname.jpg",
    "nidNumber": "1234567890123",
    "createdAt": "2024-06-02T10:30:00.000Z"
  }
]
```

---

### 5. Verify Doctor Registration (Admin)
**POST** `/doctor/verify-registration`

**Description:** Approve or reject a doctor's registration

**Request Body:**
```json
{
  "doctorId": "550e8400-e29b-41d4-a716-446655440000",
  "action": "approve"  // or "reject"
}
```

**Response:**
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

## Authentication

### JWT Token Usage
Include the token in the Authorization header for protected endpoints:
```
Authorization: Bearer <access_token>
```

### Token Details
- **Expiration:** 24 hours
- **Algorithm:** HS256
- **Payload Contains:** Doctor ID, Email, Name

---

## Error Handling

### Common Error Responses

**Validation Error (400):**
```json
{
  "statusCode": 400,
  "message": ["password must contain at least one uppercase letter..."],
  "error": "Bad Request"
}
```

**Conflict Error (409):**
```json
{
  "statusCode": 409,
  "message": "Doctor with this email, phone number, or NID already exists",
  "error": "Conflict"
}
```

**Unauthorized (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

**Not Found (404):**
```json
{
  "statusCode": 404,
  "message": "Doctor not found",
  "error": "Not Found"
}
```

---

## Registration Workflow

```
1. Doctor fills registration form with personal details
   ↓
2. Doctor uploads Medical License Image and Profile Photo
   ↓
3. System validates all inputs and creates record with "pending" status
   ↓
4. Admin reviews pending registrations
   ↓
5. Admin approves or rejects
   ↓
6. If approved: Doctor can now login
   If rejected: Doctor needs to re-register
```

---

## Setup Instructions

### 1. Environment Configuration
Create `.env` file:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run start:dev
```

### 4. Create Uploads Directory
```bash
mkdir -p uploads/doctors
```

---

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

**Example:** `SecurePass@123`

---

## File Upload Requirements
- **Formats:** JPEG, PNG, GIF
- **Max Size:** 5MB per file
- **Required Files:** 
  - Medical License Image
  - Doctor Profile Picture

---

## Database Schema

### Doctor Entity
```
- id: UUID (Primary Key)
- name: String
- email: String (Unique)
- phoneNumber: String (Unique)
- password: String (Hashed)
- specialization: String
- qualification: String
- experienceYear: Number
- hospitalName: String
- medicalLicenseNumber: String
- licenseNumber: String
- licenseImageUrl: String
- doctorImageUrl: String
- nidNumber: String (Unique)
- verificationStatus: Enum (pending | approved | rejected)
- createdAt: Timestamp
- updatedAt: Timestamp
```

---

## Testing with cURL

### Register Doctor
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

### Login Doctor
```bash
curl -X POST http://localhost:3000/doctor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "SecurePass@123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:3000/doctor/profile \
  -H "Authorization: Bearer <access_token>"
```

### Get Pending Registrations
```bash
curl -X GET http://localhost:3000/doctor/pending-registrations
```

### Verify Doctor
```bash
curl -X POST http://localhost:3000/doctor/verify-registration \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "550e8400-e29b-41d4-a716-446655440000",
    "action": "approve"
  }'
```
