import { config } from "dotenv";
import { TestRuntime } from "@tenderly/actions-test";

import { beforeAll, describe, test } from "vitest";

import {
  depositOrWithdraw,
  rewardsDistributed,
  stakingTransactions,
  stateVariablesUpdated,
} from "../actions/ggpvault";
import { getRewardsDistributedEvent } from "../actions/logParsing";

config();

describe("GGP Vault", () => {
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
        depositOrWithdraw,
        require("./payload/payload-ggpvault-redeem.json")
      );
    });
    test.concurrent("deposit", async () => {
      await testRuntime.execute(
        depositOrWithdraw,
        require("./payload/payload-ggpvault-deposit.json")
      );
    });
  });
  describe.skip("state variables updated", () => {
    test.concurrent("GGP Cap", async () => {
      await testRuntime.execute(
        stateVariablesUpdated,
        require("./payload/payload-ggpvault-ggpcap.json")
      );
    });
    test.concurrent("Target APR", async () => {
      await testRuntime.execute(
        stateVariablesUpdated,
        require("./payload/payload-ggpvault-targetapr.json")
      );
    });
  });
  describe("staking", () => {
    test.concurrent("withdrawn for staking", async () => {
      await testRuntime.execute(
        stakingTransactions,
        require("./payload/payload-ggpvault-staking-withdraw.json")
      );
    });
    test.concurrent("deposited from staking", async () => {
      await testRuntime.execute(
        stakingTransactions,
        require("./payload/payload-ggpvault-staking-deposit.json")
      );
    });
  });
  describe("rewards", () => {
    test.concurrent("distributed", async () => {
      await testRuntime.execute(
        rewardsDistributed,
        require("./payload/payload-ggpvault-distribute-rewards.json")
      );
    });
  });
});
