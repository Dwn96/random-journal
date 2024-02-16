import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

const MIN_LENGTH = 1;
const MAX_LENGTH = 500;

export class CreateJournalDto {

  @IsNotEmpty()
  @MinLength(MIN_LENGTH)
  @MaxLength(MAX_LENGTH)
  content: string;
}
