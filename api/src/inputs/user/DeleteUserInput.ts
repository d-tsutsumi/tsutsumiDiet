import { IsNotEmpty } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class DeleteUserInput {
  @Field()
  @IsNotEmpty()
  userName: string;

  @Field()
  @IsNotEmpty()
  userId: string;
}
