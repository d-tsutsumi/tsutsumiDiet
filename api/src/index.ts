import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { UserResolver, RunRecodeResolver } from "./resolvers";
import { envConf } from "./utils/config/config";
import { logger } from './utils/config/logger';

const PORT = 8080;
const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, RunRecodeResolver],
    emitSchemaFile: true,
  });
  const server = new ApolloServer({ schema, cors: envConf.gql_cors });
  await server.listen(PORT);
  logger.LogAccessInfo(`server listen to ${PORT}`);
};

main();
