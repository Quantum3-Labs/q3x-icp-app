import { IsNotEmpty, IsString } from "class-validator";

export class AddSignerDto {
  @IsString()
  @IsNotEmpty()
  principal: string;
}

export class AddSignerResponseDto {
  success: boolean;
  message: string;
}

export class RemoveSignerResponseDto {
  success: boolean;
  message: string;
}
