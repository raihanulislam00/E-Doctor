import {
	Injectable,
	BadRequestException,
	ConflictException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminRole } from './entities/admin.entity';
import { CreateMainAdminDto } from './dto/create-main-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminService {
	constructor(
		@InjectRepository(Admin)
		private adminRepository: Repository<Admin>,
		private jwtService: JwtService,
	) {}

	async registerMainAdmin(dto: CreateMainAdminDto) {
		const existingCount = await this.adminRepository.count();
		if (existingCount > 0) {
			throw new BadRequestException('Main admin already exists');
		}

		const existingAdmin = await this.adminRepository.findOne({
			where: [{ adminId: dto.adminId }, { nidNumber: dto.nidNumber }],
		});

		if (existingAdmin) {
			throw new ConflictException('Admin ID or NID already exists');
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(dto.password, salt);

		const admin = this.adminRepository.create({
			adminId: dto.adminId,
			name: dto.name,
			nidNumber: dto.nidNumber,
			address: dto.address,
			password: hashedPassword,
			role: AdminRole.MAIN,
		});

		const savedAdmin = await this.adminRepository.save(admin);

		return {
			success: true,
			message: 'Main admin created successfully',
			admin: {
				id: savedAdmin.id,
				adminId: savedAdmin.adminId,
				name: savedAdmin.name,
				role: savedAdmin.role,
			},
		};
	}

	async registerAdmin(dto: CreateAdminDto, creator: { id: string; role: AdminRole }) {
		if (creator.role !== AdminRole.MAIN) {
			throw new UnauthorizedException('Only main admin can create other admins');
		}

		const existingAdmin = await this.adminRepository.findOne({
			where: [{ adminId: dto.adminId }, { nidNumber: dto.nidNumber }],
		});

		if (existingAdmin) {
			throw new ConflictException('Admin ID or NID already exists');
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(dto.password, salt);

		const admin = this.adminRepository.create({
			adminId: dto.adminId,
			name: dto.name,
			nidNumber: dto.nidNumber,
			address: dto.address,
			password: hashedPassword,
			role: AdminRole.ADMIN,
		});

		const savedAdmin = await this.adminRepository.save(admin);

		return {
			success: true,
			message: 'Admin created successfully',
			admin: {
				id: savedAdmin.id,
				adminId: savedAdmin.adminId,
				name: savedAdmin.name,
				role: savedAdmin.role,
			},
		};
	}

	async login(dto: AdminLoginDto) {
		const admin = await this.adminRepository.findOne({
			where: { adminId: dto.adminId },
		});

		if (!admin) {
			throw new UnauthorizedException('Invalid admin ID or password');
		}

		const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid admin ID or password');
		}

		const token = this.jwtService.sign({
			id: admin.id,
			adminId: admin.adminId,
			role: admin.role,
		});

		return {
			success: true,
			message: 'Login successful',
			access_token: token,
			admin: {
				id: admin.id,
				adminId: admin.adminId,
				name: admin.name,
				role: admin.role,
			},
		};
	}
}
