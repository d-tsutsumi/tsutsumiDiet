import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { dbclient, dynamoClient } from "../utils/awsResouces";
import { PutItemCommand, PutItemCommandInput, GetItemCommand, GetItemCommandInput, } from "@aws-sdk/client-dynamodb";
import { inputPostUserType } from "./../types"
import { GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import "reflect-metadata";

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
      await dbclient.send(new PutItemCommand(params))
      return true
    }
    catch (e) {
      return false
    }
  }

  static async getUserInfo(id: string): Promise<User> {
    const params: GetItemCommandInput = {
      TableName: "Users",
      Key: {
        userId: { S: id }
      }
    }
    try {
      const data = await dynamoClient.send(new GetItemCommand(params)) as Omit<GetCommandOutput, "Item"> & {
        Item: {
          name: { S: string },
          email: { S: string },
          userId: { S: string },
          startAt: { S: string },
          rounCount?: { N: string },
          weight?: { N: string },
        }
      }
      const res = data.Item

      return {
        id: res.userId.S,
        name: res.name.S,
        mailAdress: res.email.S,
        startAt: res.startAt.S,
        runCount: res.rounCount && Number(res.rounCount.N),
        weight: res.weight && Number(res.weight.N)
      }
    } catch (e) {
      console.log(e)
      throw new Error("Dynamo db error")
    }
  }
}