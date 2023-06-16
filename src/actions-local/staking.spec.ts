import { config } from "dotenv";
import { TestRuntime } from "@tenderly/actions-test";

import { beforeAll, describe, test } from "vitest";

import { stakeOrWithdraw } from "../actions/staking";

config();

describe("Staking", () => {
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
  describe("stake or withdraw", () => {
    test.concurrent("withdraw", async () => {
      await testRuntime.execute(
        stakeOrWithdraw,
        require("./payload/payload-withdraw-staking.json")
      );
    });
    test.concurrent("stake", async () => {
      await testRuntime.execute(
        stakeOrWithdraw,
        require("./payload/payload-stake-staking.json")
      );
    });
  });
  describe("stake or withdraw non node-op", () => {
    test.concurrent("withdraw", async () => {
      await testRuntime.execute(
        stakeOrWithdraw,
        require("./payload/payload-withdraw-staking-non-node-op.json")
      );
    });
    test.concurrent("stake", async () => {
      await testRuntime.execute(
        stakeOrWithdraw,
        require("./payload/payload-stake-staking-non-node-op.json")
      );
    });
  });
});
