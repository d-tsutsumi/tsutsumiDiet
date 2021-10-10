import { User } from "../../../models/User";   
import "reflect-metadata";

const param: User = {
  "id": "gparigiaoihg;awroihgaw",
  "name": "tsutsumi",
  "mailAdress": "kani.mono56@gmail.com",
  "startAt": "1234567876543",
  "runCount": undefined,
  "weight": undefined
}

test('getUserInfo', async () => {
  const data =  await User.getUserInfo("gparigiaoihg;awroihgaw")
  console.log(param)
  console.log(data)
  expect(data).toStrictEqual(param);
})