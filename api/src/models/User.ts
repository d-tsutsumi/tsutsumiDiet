import { Field, Float, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  mailAdress: string;

  @Field()
  startAt: Date

  @Field(() => Int)
  runAt: number;

  @Field(() => Float)
  weight: number;
}