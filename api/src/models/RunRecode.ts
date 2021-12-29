import { Field, Float, ID, ObjectType } from "type-graphql";
import {
  QueryCommandInput,
  QueryCommand,
  QueryCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
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

  static async get(userId: string): Promise<RunRecode[] | void> {
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

  static async post({
    id,
    userId,
    distance,
    postAt,
    runTime,
  }: inputPostRunRecodeType): Promise<RunRecode | void> {
    const params: PutItemCommandInput = {
      TableName: RUNRECODE_TABLE,
      Item: {
        id: { S: id },
        userId: { S: userId },
        distance: { N: distance.toString() },
        postAt: { S: postAt },
        runTime: { N: runTime.toString() },
      },
    };
    const res = (await dbClient.send(new PutItemCommand(params))) as Omit<
      PutItemCommandOutput,
      "Attributes"
    > &
      RunRecodeAtributes;

    if (!res.userId || !res.id) return;

    return {
      id: res.id.S,
      userId: res.userId.S,
      distance: res.distance.N,
      postAt: res.postAt.S,
      runTime: res.runTime.N,
    };
  }
}
