import { Arg, Mutation, Query, Resolver, } from "type-graphql";
import { CreateMenuArgs } from "../inputs/CreateMenuInput";
import { User } from "../models/User";
import uuid from "node-uuid";
import { createCognitoUser } from "../utils/awsResouces/cognitoAuth";
import moment from "moment";

@Resolver()
export class UserResolver {

  @Query(returns => User)
  async getUserInfo(@Arg("id") id: string) {
    return User.getUserInfo(id);
  }

  @Mutation(returns => User)
  async createUser(@Arg("userInput") userInput: CreateMenuArgs) {
    const startAt = moment().toISOString();
    const id = uuid.v1();
    const resut = await createCognitoUser({
      userName: userInput.name,
      email: userInput.mailAdress,
      password: userInput.password,
      userId: id
    })
    if (!resut) throw new Error("user register is falled");    

    const res = User.post({
      name: userInput.name,
      email: userInput.mailAdress,
      costomUserId: id,
      startAt
    })
    if (!res) throw new Error("dynamodb exception");
    return {
      id,
      name: userInput.name,
      mailAdress: userInput.mailAdress,
      startAt
    }
  }
};
