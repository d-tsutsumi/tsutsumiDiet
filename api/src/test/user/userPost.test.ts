import { User } from "../../models/User";   
import "reflect-metadata";
import { inputPostUserType } from "../../types";
import moment from "moment";

const param:inputPostUserType = {
  costomUserId: "gparigiaoihg;awroihgaw",
  name: "tsutsumi",
  email: "kani.mono56@gmail.com",
  startAt: moment().toISOString()
}

test('postUser', async () => {
  const data =  await User.post(param)
  console.log(data)
  expect(data).toBe(true);
})