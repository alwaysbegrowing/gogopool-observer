import { config } from "dotenv";
import { TestRuntime } from "@tenderly/actions-test";

import { beforeAll, describe, test } from "vitest";

import { stakeOrWithdraw } from "../actions/ggavax";

config();

describe("GGAVAX", () => {
  const testRuntime = new TestRuntime();
  beforeAll(() => {
    /*
      -->  Shove all of the .env variables into the test runtime.
      ---> Is there a problem shoving all of them in?
      ->   I hope not.
    */
    for (const [key, value] of Object.entries(process.env)) {
      if (value) {
        testRuntime.context.secrets.put(key, value);
      }
    }
  });
  describe("deposit or withdraw", () => {
    test.concurrent("withdraw", async () => {
      await testRuntime.execute(
        stakeOrWithdraw,
        require("./payload/payload-ggavax-withdraw.json")
      );
    });
    test.concurrent("deposit", async () => {
      await testRuntime.execute(
        stakeOrWithdraw,
        require("./payload/payload-ggavax-deposit.json")
      );
    });
  });
});
