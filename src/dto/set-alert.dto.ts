import { IsEmail, IsNumber, IsString, IsIn } from 'class-validator';

export class SetAlertDto {
  @IsString()
  @IsIn(['ethereum', 'polygon'], {
    message: 'Chain must be either "ethereum" or "polygon".',
  })
  chain: string;

  @IsNumber()
  targetPrice: number;

  @IsEmail()
  email: string;
}
