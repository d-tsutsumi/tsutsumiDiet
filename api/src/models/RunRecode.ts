import { Field, Float, ID, ObjectType } from "type-graphql";


@ObjectType()
export class RunRecode {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  distance: number;

  @Field()
  postAt: Date

  @Field(() => Float)
  runTime: number;

  @Field()
  userId: string
}