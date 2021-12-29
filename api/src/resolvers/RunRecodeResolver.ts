import { Arg, Mutation, Query, Resolver } from "type-graphql";
import uuid from "node-uuid";
import moment from "moment";

import { PostRunRecodeInput } from "../inputs/runRecode/postRunRecodeInout";
import { RunRecode } from "../models/RunRecode";
import { ApolloError } from "apollo-server";

@Resolver()
export class RunRecodeResolver {
  @Query((returns) => RunRecode)
  async getRunRecode(
    @Arg("userId") userId: string
  ): Promise<RunRecode[] | undefined> {
    const res = await RunRecode.get(userId);
    if (!res) return;
    return res;
  }

  @Mutation((returns) => RunRecode)
  async postRunRecode(
    @Arg("runReocdeInput") runRecodeInput: PostRunRecodeInput
  ) {
    const { runTime, userId, distance } = runRecodeInput;
    const id = uuid.v1();
    const postAt = moment().toISOString();
    const res = RunRecode.post({ id, userId, runTime, distance, postAt });
    if (!res) new ApolloError("interval server error");
    return res;
  }
}
