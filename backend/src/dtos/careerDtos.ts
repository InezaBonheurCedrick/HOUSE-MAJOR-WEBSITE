import { IsString, IsOptional, IsArray, IsEmail, IsNumber, IsUrl, Length } from "class-validator";

export class CareerCreateDto {
  @IsString()
  @Length(2, 100)
  title!: string;

  @IsString()
  @Length(2, 100)
  department!: string;

  @IsString()
  type!: string;

  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  salary?: string | null;

  @IsOptional()
  @IsString()
  experience?: string | null;

  @IsOptional()
  @IsString()
  posted?: string | null;

  @IsString()
  description!: string;

  @IsArray()
  requirements!: string[];

  @IsArray()
  responsibilities!: string[];
}

export class CareerResponseDto extends CareerCreateDto {
  @IsNumber()
  id!: number;

  createdAt!: Date;
}

export class ApplicationCreateDto {
  @IsString()
  @Length(2, 100)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsUrl()
  resumeUrl?: string | null;

  @IsOptional()
  @IsString()
  coverLetter?: string | null;

  @IsOptional()
  @IsString()
  jobTitle?: string | null;

  @IsOptional()
  @IsNumber()
  careerId?: number | null;
}

export class ApplicationResponseDto extends ApplicationCreateDto {
  @IsNumber()
  id!: number;

  createdAt!: Date;
}
