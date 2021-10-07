import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { dynamodbClient, } from "../utils/awsResouces";
import { PutItemCommand, PutItemCommandInput, GetItemCommand, GetItemCommandInput  } from "@aws-sdk/client-dynamodb";
import { inputPostUserType } from "./../types"
import moment from "moment";

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

  static async post(inputPostUser: inputPostUserType): Promise<string | boolean> {
    const { name, email, costomUserId } = inputPostUser
    const startAt = moment().toISOString();
    const params: PutItemCommandInput = {
      TableName: "Users",
      Item: {
        name: { S: name },
        mailAdress: { S: email },
        id: { S: costomUserId },
        startAt: { S: startAt }
      }
    }
    try {
      const data = await dynamodbClient.send(new PutItemCommand(params))
      return startAt
    }
    catch (e) {
      return false
    }
  }

  static async getUserInfo(id :string): Promise<User> {
    const params: GetItemCommandInput = {
      TableName: "Users",
      Key: {
        id: {S: id}
      }
    }

    const data = await dynamodbClient.send(new GetItemCommand(params));
    const res = data.Item
    console.log(res);
    return {
      id: "test",
      name: "test",
      mailAdress: "test@rahrawg",
      startAt: "1234567890"
    }
  }
}