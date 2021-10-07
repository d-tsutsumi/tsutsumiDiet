import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateMenuArgs } from "../inputs/CreateMenuInput";
import { User } from "../models/User";
import uuid from "node-uuid";
import { createCognitoUser } from "../utils/awsResouces/cognitoAuth";
@Resolver()
export class UserResolver{

  @Query(returns  => User)
  async getUserInfo(@Arg("id") id: string) {
    return User.getUserInfo(id);
  }
  
  @Mutation(returns  => User )
  async createUser ( @Arg("userInput")userInput: CreateMenuArgs) {
    console.log("start!!!!!")
    const id = uuid.v1();
    let startAt
    try{
        await createCognitoUser({
        userName: userInput.name,
        email: userInput.mailAdress,
        password: userInput.password,
        userId: id
      })
    }catch(e) {
      //要検討
      console.log(e);
      console.log("ユーザー登録に失敗しました。")
    }
    try{
        startAt = User.post({
        name: userInput.name,
        email: userInput.mailAdress,
        costomUserId: id
      })
      return {
        id,
        name: userInput.name,
        mailAdress: userInput.mailAdress,
        startAt
      }
    }catch(e){
      console.log(e);
      console.log("ユーザー登録に失敗しました。")
    }
    return {
      id,
      name: userInput.name,
      mailAdress: userInput.mailAdress,
      startAt
    }
  }
};
