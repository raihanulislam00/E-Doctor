import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AdminRole {
  MAIN = 'main',
  ADMIN = 'admin',
}

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  adminId: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  nidNumber: string;

  @Column()
  address: string;

  @Column({ type: 'text', default: AdminRole.ADMIN })
  role: AdminRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
