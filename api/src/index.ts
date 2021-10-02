import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { dynamodbClient } from "./utils/awsResouces";
import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { Logger } from "./utils/logger";

// const main = async () => {
//   Logger.initialize();
//   const schema = await buildSchema({
//     // resolvers: [],
//     emitSchemaFile: true
//   })
//   const server = new ApolloServer({ schema });
//   await server.listen(5000);
//   console.log("server run glaphql server");
// }

// main();