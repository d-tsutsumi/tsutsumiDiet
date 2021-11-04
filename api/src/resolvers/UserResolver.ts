import { Arg, Mutation, Query, Resolver, } from "type-graphql";
import { CreateMenuArgs } from "../inputs/CreateMenuInput";
import { User } from "../models/User";
import uuid from "node-uuid";
import { createCognitoUser } from "../utils/awsResouces/cognitoAuth";
import moment from "moment";
import { PutMenuArgs } from "../inputs/PutMenuInput";

@Resolver()
export class UserResolver {

  @Query(returns => User)
  async getUserInfo(@Arg("id") id: string) {
    return await User.getUserInfo(id);
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

    const res = await User.post({
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

  @Mutation(returns => User)
  async putUser(@Arg("userInput") UserInput: PutMenuArgs) {
    const { userId, name, mailAdress, weight, password } = UserInput
    const user = await User.getUserInfo(userId);
    if (!user) throw new Error("user is not  found");

    const res = await User.put(userId, {
      mailAdress,
      name,
      weight
    })

    if (!name && !mailAdress && !password) {
      return {
        userId: res.id,
        name: res.name,
        mailAdress: res.mailAdress,
        weight: res.weight,
        startAt: res.startAt
      }
    }
    
  }
};
