import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { UserResolver, RunRecodeResolver } from "./resolvers";
import { envConf } from "./utils/config/config";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, RunRecodeResolver],
    emitSchemaFile: true,
  });
  const server = new ApolloServer({ schema, cors: envConf.gql_cors });
  await server.listen(8080);
  console.log("server run glaphql server");
};

main();
