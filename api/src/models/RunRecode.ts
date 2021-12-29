import { Field, Float, ID, ObjectType } from "type-graphql";
import {
  QueryCommandInput,
  QueryCommand,
  QueryCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { inputPostRunRecodeType } from "../types";
import { dbClient } from "../utils/awsResouces";
import { envConf } from "../utils/config/config";

interface RunRecodeAtributes {
  id: { S: string };
  userId: { S: string };
  distance: { N: number };
  postAt: { S: string };
  runTime: { N: number };
}

interface runRecodeType {
  Item: RunRecodeAtributes;
}

interface runRecodeTypes {
  Items: RunRecodeAtributes[] | undefined;
}
const RUNRECODE_TABLE = envConf.dynamoDBTable.runReocdeTable;

@ObjectType()
export class RunRecode {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => Float)
  distance: number;

  @Field()
  postAt: string;

  @Field(() => Float)
  runTime: number;

  static async get(userId: string): Promise<RunRecode[] | undefined> {
    const param: QueryCommandInput = {
      TableName: RUNRECODE_TABLE,
      KeyConditionExpression: "userId = :s",
      ExpressionAttributeValues: {
        ":s": { S: userId },
      },
    };
    const { Items } = (await dbClient.send(new QueryCommand(param))) as Omit<
      QueryCommandOutput,
      "Items"
    > &
      runRecodeTypes;

    if (!Items) return;

    const runRecode = Items.map((value) => ({
      id: value.id.S,
      userId: value.userId.S,
      distance: value.distance.N,
      postAt: value.postAt.S,
      runTime: value.runTime.N,
    }));

    return runRecode;
  }

  static async post(recodeArgs: inputPostRunRecodeType) {}
}
