import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([Admin]),
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
			signOptions: { expiresIn: '24h' },
		}),
	],
	controllers: [AdminController],
	providers: [AdminService, AdminJwtStrategy],
	exports: [AdminService],
})
export class AdminModule {}
