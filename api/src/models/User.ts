import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { dynamodbClient, } from "../utils/awsResouces";
import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { Logger } from "../utils/logger";
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
  startAt: Date

  @Field(() => Int)
  runCount: number;

  @Field(() => Float)
  weight: number;

  async post(inputPostUser: inputPostUserType): Promise<boolean> {
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
      Logger.LogAccessInfo(data);
      Logger.LogAccessInfo("dynamo access");
      return true
    }
    catch (e) {
      Logger.LogAccessError(e);
      return false
    }
  }
}