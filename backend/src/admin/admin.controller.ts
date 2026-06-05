import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateMainAdminDto } from './dto/create-main-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminJwtAuthGuard } from './guards/admin-jwt.guard';

@Controller('admin')
export class AdminController {
	constructor(private adminService: AdminService) {}

	@Post('register-main')
	async registerMain(@Body() dto: CreateMainAdminDto) {
		return this.adminService.registerMainAdmin(dto);
	}

	@Post('register')
	@UseGuards(AdminJwtAuthGuard)
	async registerAdmin(@Body() dto: CreateAdminDto, @Request() req: any) {
		return this.adminService.registerAdmin(dto, req.user);
	}

	@Post('login')
	async login(@Body() dto: AdminLoginDto) {
		return this.adminService.login(dto);
	}
}
