import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { dbclient, dynamoClient } from "../utils/awsResouces";
import { PutItemCommand, PutItemCommandInput, GetItemCommand, GetItemCommandInput, } from "@aws-sdk/client-dynamodb";
import { inputPostUserType, inputPutUserType } from "./../types"
import { GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import "reflect-metadata";

interface UserItemType {
  Item: {
    name: { S: string },
    mailAdress: { S: string },
    userId: { S: string },
    startAt: { S: string },
    rounCount?: { N: string },
    weight?: { N: string },
  }
}

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  mailAdress: string;

  @Field()
  startAt: string

  @Field(() => Int)
  runCount?: number;

  @Field(() => Float)
  weight?: number;

  static async post(inputPostUser: inputPostUserType): Promise<boolean> {
    const { name, email, costomUserId, startAt } = inputPostUser
    const params: PutItemCommandInput = {
      TableName: "Users",
      Item: {
        name: { S: name },
        mailAdress: { S: email },
        userId: { S: costomUserId },
        startAt: { S: startAt }
      }
    }
    try {
      const res = await dbclient.send(new PutItemCommand(params))
      console.log(res)
      return true
    }
    catch (e) {
      console.log(e);
      throw new Error("not registerd user");
    }
  }

  static async put(id: string, input: inputPutUserType): Promise<boolean> {
    const user = await this.getUserInfo(id);
    const param: PutItemCommandInput = {
      TableName: "Users",
      Item: {
        userId: { S: user.id },
        name: { S: input.name ? input.name : user.name },
        mailAdress: { S: input.email ? input.email : user.mailAdress },
        startAt: { S: user.startAt },
        weight: { N: input.weight ? String(input.weight) : String(user.weight) }
      }
    }
    try {
      const res = await dbclient.send(new PutItemCommand(param));
      console.log(res);

      return true;
    } catch (e) {
      console.log(e)
      throw new Error("dynamo db error")
    }
  };

  static async getUserInfo(id: string): Promise<User> {
    const params: GetItemCommandInput = {
      TableName: "Users",
      Key: {
        userId: { S: id }
      }
    }
    try {
      const data = await dynamoClient.send(new GetItemCommand(params)) as Omit<GetCommandOutput, "Item"> & UserItemType

      if (!data.Item) throw new Error("user not found");

      const res = data.Item
      return {
        id: res.userId.S,
        name: res.name.S,
        mailAdress: res.mailAdress.S,
        startAt: res.startAt.S,
        runCount: res.rounCount && Number(res.rounCount.N),
        weight: res.weight && Number(res.weight.N)
      }
    } catch (e) {
      console.log(e)
      throw new Error("Dynamo db Exception")
    }
  }
}