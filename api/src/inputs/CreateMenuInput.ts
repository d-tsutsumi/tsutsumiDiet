import {  Field, InputType } from "type-graphql";

@InputType()
export class CreateMenuArgs  {
  @Field()
  name: string;

  @Field()
  mailAdress: string;

  @Field()
  password: string;
}