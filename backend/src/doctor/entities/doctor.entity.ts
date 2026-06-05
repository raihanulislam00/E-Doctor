import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  specialization: string;

  @Column()
  qualification: string;

  @Column()
  experienceYear: number;

  @Column()
  hospitalName: string;

  @Column()
  medicalLicenseNumber: string;

  @Column()
  licenseNumber: string;

  @Column({ nullable: true })
  licenseImageUrl: string;

  @Column({ nullable: true })
  doctorImageUrl: string;

  @Column({ unique: true })
  nidNumber: string;

  @Column({ type: 'text', default: VerificationStatus.PENDING })
  verificationStatus: VerificationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
