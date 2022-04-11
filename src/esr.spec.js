/**
 * @jest-environment jsdom
 */

import { ESRUtil } from "./main";
import fetch from "node-fetch";
const esrUtil = new ESRUtil(undefined, fetch);
const TEST_ESR =
  "esr://gmNgZGAoCOJiniNoxAAEK3KCrjIyMkAAE5QuggkwOJhY7Xx7qYSnJLW4RCE5sySzKjXPqry8XC8jpTwxJ6cgsSC1SC-vVL-8QDc5P68kNa9Ev7QgJz8xpVjfyMDQQt_ASD-xLLEksUjXWC-rIJ0vBGhOZl66QmJRfmleClNhIhCxgAwH2ggA";
const TEST_ACTION = [
  {
    account: "eosio.login",
    name: "loginuser",
    authorization: [
      {
        actor: "............1",
        permission: "............2",
      },
    ],
    data: {
      account_name: "............1",
      login_code: 9081615,
    },
  },
];

// test("Decoded ESR returns appropriate action", async () => {
//   const decodedESR = await esrUtil.decodeESR(TEST_ESR);
//   expect(decodedESR.data).toBeTruthy();
// });

test("Encode action into ESR", async () => {
  const encodedESR = await esrUtil.encodeESR(TEST_ACTION);
  console.log("ENCODED ESR: ", encodedESR);
  expect(encodedESR).toBeTruthy();
});
