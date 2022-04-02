import ESRUtil from "./main";

const esrUtil = new ESRUtil();
const TEST_REQUEST_DATA = {};

const TEST_ESR =
  "esr://gmNgZGAoCOJiniNoxAAEK3KCrjIyMkAAE5QuggkwOJhY7Xx7qYSnJLW4RCE5sySzKjXPqry8XC8jpTwxJ6cgsSC1SC-vVL-8QDc5P68kNa9Ev7QgJz8xpVjfyMDQQt_ASD-xLLEksUjXWC-rIJ0vBGhOZl66QmJRfmleClNhIhCxgAwH2ggA";
const TEST_ACTION = "";

test("Decoded ESR returns appropriate action", async () => {
  const decodedESR = await esrUtil.decodeESR(TEST_ESR);
  expect(decodedESR.data).toBeTruthy();
});

test("Encode action into ESR", async () => {
  const decodedESR = await esrUtil.decodeESR(TEST_ESR);
  expect(decodedESR.data).toBeTruthy();
});
