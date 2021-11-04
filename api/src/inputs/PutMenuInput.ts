import { Field, InputType } from "type-graphql";

@InputType()
export class PutMenuArgs {

  @Field()
  userId: string;

  @Field()
  name?: string;

  @Field()
  mailAdress?: string;

  @Field()
  password?: string;

  @Field()
  weight?: number
}