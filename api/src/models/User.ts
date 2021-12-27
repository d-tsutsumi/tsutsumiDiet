import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { dbclient } from "../utils/awsResouces";
import {
  PutItemCommand,
  PutItemCommandInput,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommandOutput,
  DeleteItemInput,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { inputPostUserType, inputPutUserType } from "./../types";
import {GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import "reflect-metadata";
import { ApolloError } from "apollo-server";
import { UserErrCode } from "../utils/error/errorCode";

interface UserItemType {
  Item: {
    name: { S: string };
    mailAdress: { S: string };
    userId: { S: string };
    startAt: { S: string };
    rounCount?: { N: string };
    weight?: { N: string };
  };
}

const TABLE_NAME = "Users";
@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  mailAdress: string;

  @Field()
  startAt: string;

  @Field(() => Int)
  runCount?: number;

  @Field(() => Float)
  weight?: number;

  static async post(inputPostUser: inputPostUserType): Promise<boolean> {
    const { name, email, costomUserId, startAt } = inputPostUser;
    const params: PutItemCommandInput = {
      TableName: TABLE_NAME,
      Item: {
        name: { S: name },
        mailAdress: { S: email },
        userId: { S: costomUserId },
        startAt: { S: startAt },
      },
    };
    try {
      const res = await dbclient.send(new PutItemCommand(params));
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  static async put(id: string, input: inputPutUserType): Promise<User> {
    const user = await this.getUserInfo(id);
    const { message, code } = UserErrCode.NotFoundError;
    if (!user) throw new ApolloError(message, code);
    const param: PutItemCommandInput = {
      TableName: TABLE_NAME,
      Item: {
        userId: { S: id },
        name: { S: input.name ? input.name : user.name },
        mailAdress: { S: input.email ? input.email : user.mailAdress },
      },
    };
    if (input.weight) {
      param.Item = {
        ...param.Item,
        weight: {
          N: input.weight ? String(input.weight) : String(user.weight),
        },
      };
    }
    console.log(param);
    try {
      const { Item } = (await dbclient.send(new PutItemCommand(param))) as Omit<
        PutItemCommandOutput,
        "Item"
      > &
        UserItemType;
      return {
        id: Item.userId.S,
        name: Item.name.S,
        mailAdress: Item.mailAdress.S,
        startAt: Item.startAt.S,
        runCount: Item.rounCount && Number(Item.rounCount.N),
        weight: Item.weight && Number(Item.weight.N),
      };
    } catch (e) {
      console.log(e);
      throw new Error("dynamo db error");
    }
  }

  static async getUserInfo(id: string): Promise<User | null> {
    const params: GetItemCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        userId: { S: id },
      },
    };
    const data = (await dbclient.send(new GetItemCommand(params))) as Omit<
      GetCommandOutput,
      "Item"
    > &
      UserItemType;

    if (!data.Item) return null;

    const res = data.Item;
    return {
      id: res.userId.S,
      name: res.name.S,
      mailAdress: res.mailAdress.S,
      startAt: res.startAt.S,
      runCount: res.rounCount && Number(res.rounCount.N),
      weight: res.weight && Number(res.weight.N),
    };
  }
  static async delete(id: string): Promise<boolean> {
    const param: DeleteItemInput = {
      TableName: TABLE_NAME,
      Key: {
        userId: { S: id },
      },
    };
    const res = await dbclient.send(new DeleteItemCommand(param));
    return res ? true : false;
  }
}
