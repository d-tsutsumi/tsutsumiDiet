import { User } from "../../../models/User";
import { inputPutUserType } from "../../../types";

const param: inputPutUserType = {
  name: "tsutsumi123",
  email: "kani.mono56@gmail.com",
};

const userId = "gparigiaoihg;awroihgaw";

test("user put", async () => {
  const data = await User.put(userId, param);
  console.log(data);
  expect(data).toBe(true);
});
