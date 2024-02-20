import { config } from "dotenv";
import { TestPeriodicEvent, TestRuntime } from "@tenderly/actions-test";

import { beforeAll, describe, test } from "vitest";

import { checkRewardsPeriodic } from "../actions/rewards";

config();

describe("Rewards", () => {
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
  describe("test rewards message", () => {
    test.concurrent("new period start", async () => {
      testRuntime.context.storage.clear();
      const event = new TestPeriodicEvent();
      event.time = new Date("2023-07-01T00:00:00.000Z");
      await testRuntime.execute(checkRewardsPeriodic, event);
    });
    test.concurrent("eligibility warning", async () => {
      testRuntime.context.storage.clear();
      const event = new TestPeriodicEvent();
      event.time = new Date("2023-07-10T00:00:00.000Z");
      await testRuntime.execute(checkRewardsPeriodic, event);
    });
    test.concurrent("end warning", async () => {
      testRuntime.context.storage.clear();
      const event = new TestPeriodicEvent();
      event.time = new Date("2023-07-24T22:00:00.000Z");
      await testRuntime.execute(checkRewardsPeriodic, event);
    });
  });
});
