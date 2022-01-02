import { Field, Float, ID, ObjectType } from "type-graphql";
import {
  QueryCommandInput,
  QueryCommand,
  QueryCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { inputPostRunRecodeType } from "../types";
import { dbClient } from "../utils/awsResouces";
import { envConf } from "../utils/config/config";
import { ApolloError } from "apollo-server";

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

  static async get(userId: string): Promise<RunRecode[] | undefined> {
    const param: QueryCommandInput = {
      TableName: RUNRECODE_TABLE,
      KeyConditionExpression: "userId = :s",
      ExpressionAttributeValues: {
        ":s": { S: userId },
      },
    };
    try {
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
    } catch (e) {
      console.log(e);
      throw new ApolloError("Dynamodb error");
    }
  }

  static async post({
    id,
    userId,
    distance,
    postAt,
    runTime,
  }: inputPostRunRecodeType): Promise<RunRecode | undefined> {
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
    try {
      await dbClient.send(new PutItemCommand(params));
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        console.log(e);
        throw new ApolloError(e.message, e.name);
      }
      throw new ApolloError("dynamo db error");
    }
    return {
      id,
      userId,
      distance,
      postAt,
      runTime,
    };
  }
}

@ObjectType()
export class sumDistance {
  @Field(() => Float)
  ditance: number;

  static async getSamDistance(userId: string): Promise<number> {
    const res = await RunRecode.get(userId);
    if (!res) return 0;
    return res.reduce((previousValue, value) => {
      return previousValue + value.distance;
    }, res[0].distance);
  }
}
