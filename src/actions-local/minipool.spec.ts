import { config } from "dotenv";
import { TestRuntime } from "@tenderly/actions-test";

import { beforeAll, describe, test } from "vitest";

import { minipoolStatusChange } from "../actions/minipool";

config();

describe("Minipool", () => {
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
  describe("Statuses", () => {
    test.concurrent("0 [prelaunch].", async () => {
      await testRuntime.execute(
        minipoolStatusChange,
        require("./payload/payload-prelaunch-minipool.json")
      );
    });
    test.concurrent("1 [launched].", async () => {
      await testRuntime.execute(
        minipoolStatusChange,
        require("./payload/payload-launched-minipool.json")
      );
    });
    test.concurrent("2 [staking].", async () => {
      await testRuntime.execute(
        minipoolStatusChange,
        require("./payload/payload-staking-minipool.json")
      );
    });
    test.concurrent("3 [withdrawable].", async () => {
      await testRuntime.execute(
        minipoolStatusChange,
        require("./payload/payload-withdrawable-minipool.json")
      );
    });
  });
});
