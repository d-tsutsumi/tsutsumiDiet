import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";


const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true
  })
  const server = new ApolloServer({ schema });
  await server.listen(8888);
  console.log("server run glaphql server");
}

main();