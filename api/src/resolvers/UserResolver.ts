import { Arg, Mutation, Query, Resolver, ID } from "type-graphql";
import { User } from "../models/User";
import uuid from "node-uuid";
import cognitoAuth from "../utils/awsResouces/cognitoAuth";
import moment from "moment";
import { ApolloError } from "apollo-server";
import { DeleteUserInput, CreateUserInput, PutUserInput } from "../inputs";
import { UserErrCode } from "../utils/error/errorCode";

@Resolver()
export class UserResolver {
  @Query((returns) => User)
  async getUserInfo(@Arg("id") id: string) {
    const res = await User.getUserInfo(id);
    if (!res) {
      const { message, code } = UserErrCode.NotFoundError;
      throw new ApolloError(message, code);
    }
    return res;
  }

  @Mutation((returns) => User)
  async createUser(@Arg("userInput") userInput: CreateUserInput) {
    const { name, mailAdress, password } = userInput;
    const startAt = moment().toISOString();
    const id = uuid.v1();
    const result = await cognitoAuth.createUser({
      userName: name,
      email: mailAdress,
      password: password,
      userId: id,
    });
    if (!result.result && result.error)
      throw new ApolloError(result.error.errMessage, result.error.errName);
    if (!result.result && !result.error) throw new ApolloError("Exception");

    const res = await User.post({
      name: name,
      email: mailAdress,
      costomUserId: id,
      startAt,
    });

    if (!res) {
      cognitoAuth.deleteUser({ userName: name });
      const { message, code } = UserErrCode.NotUserRegistedError;
      throw new ApolloError(message, code);
    }

    return {
      id,
      name: userInput.name,
      mailAdress: userInput.mailAdress,
      startAt,
    };
  }

  @Mutation((returns) => User)
  async putUser(@Arg("userInput") userInput: PutUserInput) {
    const { userId, name, mailAdress, weight, password } = userInput;
    const user = await User.getUserInfo(userId);
    if (!user) throw new Error("user is not  found");

    const res = await User.put(userId, {
      mailAdress,
      name,
      weight,
    });

    if (!name && !mailAdress && !password) {
      return {
        userId: res.id,
        name: res.name,
        mailAdress: res.mailAdress,
        weight: res.weight,
        startAt: res.startAt,
      };
    }
  }
  @Mutation((returns) => User)
  async deleteUser(@Arg("userInput") userInput: DeleteUserInput) {
    const { userId, userName } = userInput;
    const res = this.getUserInfo(userId);
    cognitoAuth.deleteUser({ userName });
    User.delete(userId);
    return res;
  }
}
