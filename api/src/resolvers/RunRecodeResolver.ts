import { Arg, Mutation, Query, Resolver } from "type-graphql";
import uuid from "node-uuid";
import moment from "moment";

import { PostRunRecodeInput } from "../inputs/runRecode/postRunRecodeInout";
import { RunRecode, sumDistance } from "../models/RunRecode";

@Resolver()
export class RunRecodeResolver {
  @Query((returns) => [RunRecode])
  async getRunRecode(
    @Arg("userId") userId: string
  ): Promise<RunRecode[] | undefined> {
    const res = await RunRecode.get(userId);
    if (!res) return;
    return res;
  }

  @Query((returns) => sumDistance)
  async getSumdistance(@Arg("userId") userId: string): Promise<number> {
    return await sumDistance.getSamDistance(userId);
  }

  @Mutation((returns) => RunRecode)
  async postRunRecode(
    @Arg("runReocdeInput") runRecodeInput: PostRunRecodeInput
  ): Promise<RunRecode | undefined> {
    const { runTime, userId, distance } = runRecodeInput;
    const id = uuid.v1();
    const postAt = moment().toISOString();
    const res = await RunRecode.post({ id, userId, runTime, distance, postAt });
    return res;
  }
}
