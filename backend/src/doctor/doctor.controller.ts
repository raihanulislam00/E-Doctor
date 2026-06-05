import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DoctorService } from './doctor.service';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { LoginDoctorDto } from './dto/login-doctor.dto';
import { VerifyDoctorDto } from './dto/verify-doctor.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminJwtAuthGuard } from '../admin/guards/admin-jwt.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: './uploads/doctors',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new BadRequestException('Only image files are allowed'), false);
  }
  cb(null, true);
};

@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Post('register')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'licenseImage', maxCount: 1 },
        { name: 'doctorImage', maxCount: 1 },
      ],
      {
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
      },
    ),
  )
  async register(
    @Body() registerDoctorDto: RegisterDoctorDto,
    @UploadedFiles()
    files: {
      licenseImage?: any[];
      doctorImage?: any[];
    },
  ) {
    if (!files?.licenseImage || !files?.doctorImage) {
      throw new BadRequestException('Both license image and doctor image are required');
    }

    const licenseImagePath = files.licenseImage[0]?.path;
    const doctorImagePath = files.doctorImage[0]?.path;

    return this.doctorService.register(registerDoctorDto, licenseImagePath, doctorImagePath);
  }

  @Post('login')
  async login(@Body() loginDoctorDto: LoginDoctorDto) {
    return this.doctorService.login(loginDoctorDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.doctorService.getDoctorProfile(req.user.id);
  }

  @Get('pending-registrations')
  @UseGuards(AdminJwtAuthGuard)
  async getPendingRegistrations() {
    return this.doctorService.getPendingDoctors();
  }

  @Post('verify-registration')
  @UseGuards(AdminJwtAuthGuard)
  async verifyRegistration(@Body() verifyDoctorDto: VerifyDoctorDto) {
    return this.doctorService.verifyDoctor(verifyDoctorDto);
  }
}
