import { IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class PostRunRecodeInput {

  @Field()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsNotEmpty()
  distance: number;

  @Field()
  @IsNotEmpty()
  runTime: number;
}
