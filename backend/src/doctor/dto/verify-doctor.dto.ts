import { IsUUID, IsEnum, IsNotEmpty } from 'class-validator';

export enum VerificationAction {
  APPROVE = 'approve',
  REJECT = 'reject',
}

export class VerifyDoctorDto {
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @IsEnum(VerificationAction)
  @IsNotEmpty()
  action: VerificationAction;
}
