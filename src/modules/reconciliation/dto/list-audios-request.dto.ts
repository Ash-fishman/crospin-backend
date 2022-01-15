import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ListAudiosRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;
}
