import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Doctor, VerificationStatus } from './entities/doctor.entity';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { LoginDoctorDto } from './dto/login-doctor.dto';
import { VerifyDoctorDto, VerificationAction } from './dto/verify-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private jwtService: JwtService,
  ) {}

  async register(registerDoctorDto: RegisterDoctorDto, licenseImagePath?: string, doctorImagePath?: string): Promise<any> {
    // Check if doctor already exists
    const existingDoctor = await this.doctorRepository.findOne({
      where: [
        { email: registerDoctorDto.email },
        { phoneNumber: registerDoctorDto.phoneNumber },
        { nidNumber: registerDoctorDto.nidNumber },
      ],
    });

    if (existingDoctor) {
      throw new ConflictException('Doctor with this email, phone number, or NID already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDoctorDto.password, salt);

    // Create new doctor
    const doctor = this.doctorRepository.create({
      ...registerDoctorDto,
      password: hashedPassword,
      licenseImageUrl: licenseImagePath,
      doctorImageUrl: doctorImagePath,
      verificationStatus: VerificationStatus.PENDING,
    });

    const savedDoctor = await this.doctorRepository.save(doctor);

    return {
      success: true,
      message: 'Registration successful! Please wait for admin verification.',
      doctor: {
        id: savedDoctor.id,
        email: savedDoctor.email,
        name: savedDoctor.name,
        verificationStatus: savedDoctor.verificationStatus,
      },
    };
  }

  async login(loginDoctorDto: LoginDoctorDto): Promise<any> {
    const doctor = await this.doctorRepository.findOne({
      where: { email: loginDoctorDto.email },
    });

    if (!doctor) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if doctor is verified
    if (doctor.verificationStatus !== VerificationStatus.APPROVED) {
      throw new UnauthorizedException(
        `Your account is ${doctor.verificationStatus}. Please wait for admin approval.`,
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(loginDoctorDto.password, doctor.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      id: doctor.id,
      email: doctor.email,
      name: doctor.name,
    });

    return {
      success: true,
      message: 'Login successful',
      access_token: token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
      },
    };
  }

  async getPendingDoctors(): Promise<any[]> {
    const doctors = await this.doctorRepository.find({
      where: { verificationStatus: VerificationStatus.PENDING },
    });

    return doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experienceYear: doctor.experienceYear,
      hospitalName: doctor.hospitalName,
      medicalLicenseNumber: doctor.medicalLicenseNumber,
      licenseNumber: doctor.licenseNumber,
      licenseImageUrl: doctor.licenseImageUrl,
      doctorImageUrl: doctor.doctorImageUrl,
      nidNumber: doctor.nidNumber,
      createdAt: doctor.createdAt,
    }));
  }

  async verifyDoctor(verifyDoctorDto: VerifyDoctorDto): Promise<any> {
    const doctor = await this.doctorRepository.findOne({
      where: { id: verifyDoctorDto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (doctor.verificationStatus !== VerificationStatus.PENDING) {
      throw new BadRequestException('Doctor has already been verified or rejected');
    }

    const status = verifyDoctorDto.action === VerificationAction.APPROVE ? VerificationStatus.APPROVED : VerificationStatus.REJECTED;

    doctor.verificationStatus = status;
    const updatedDoctor = await this.doctorRepository.save(doctor);

    return {
      success: true,
      message: `Doctor ${verifyDoctorDto.action === VerificationAction.APPROVE ? 'approved' : 'rejected'} successfully`,
      doctor: {
        id: updatedDoctor.id,
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        verificationStatus: updatedDoctor.verificationStatus,
      },
    };
  }

  async getDoctorProfile(doctorId: string): Promise<any> {
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experienceYear: doctor.experienceYear,
      hospitalName: doctor.hospitalName,
      medicalLicenseNumber: doctor.medicalLicenseNumber,
      licenseNumber: doctor.licenseNumber,
      licenseImageUrl: doctor.licenseImageUrl,
      doctorImageUrl: doctor.doctorImageUrl,
      verificationStatus: doctor.verificationStatus,
      createdAt: doctor.createdAt,
    };
  }
}
