import { Context, Event, PeriodicEvent, TransactionEvent } from "@tenderly/actions";
import { RewardsInformation } from "./types";
import { jsonRpcProvider } from "./ethers";
import {
  PROTOCOL_DAO_ADDRESS,
  PROTOCOL_DAO_INTERFACE,
  REWARDS_POOL_ADDRESS,
  REWARDS_POOL_INTERFACE,
} from "./constants";
import { initServices } from "./utils";
import { emitter } from "./emitter";
import { BigNumber } from "ethers";
import {
  REWARDS_ELIGIBILITY_REMINDER_TEMPLATE,
  REWARDS_ENDING_REMINDER_TEMPLATE,
  REWARDS_NEW_CYCLE_TEMPLATE,
} from "./templates";

const getRewardsInformation = async (): Promise<RewardsInformation> => {
  const getRewardsCycleStartTime = jsonRpcProvider.getProvider().call({
    to: REWARDS_POOL_ADDRESS,
    data: REWARDS_POOL_INTERFACE.encodeFunctionData("getRewardsCycleStartTime"),
  });
  const getRewardsCycleTotalAmt = jsonRpcProvider.getProvider().call({
    to: REWARDS_POOL_ADDRESS,
    data: REWARDS_POOL_INTERFACE.encodeFunctionData("getRewardsCycleTotalAmt"),
  });
  const getRewardsCycleCount = jsonRpcProvider.getProvider().call({
    to: REWARDS_POOL_ADDRESS,
    data: REWARDS_POOL_INTERFACE.encodeFunctionData("getRewardsCycleCount"),
  });
  const getInflationAmt = jsonRpcProvider.getProvider().call({
    to: REWARDS_POOL_ADDRESS,
    data: REWARDS_POOL_INTERFACE.encodeFunctionData("getInflationAmt"),
  });
  const getRewardsCycleSeconds = jsonRpcProvider.getProvider().call({
    to: PROTOCOL_DAO_ADDRESS,
    data: PROTOCOL_DAO_INTERFACE.encodeFunctionData("getRewardsCycleSeconds"),
  });
  const getRewardsEligibilityMinSeconds = jsonRpcProvider.getProvider().call({
    to: PROTOCOL_DAO_ADDRESS,
    data: PROTOCOL_DAO_INTERFACE.encodeFunctionData(
      "getRewardsEligibilityMinSeconds"
    ),
  });

  const [
    getRewardsCycleStartTimeResult,
    getRewardsCycleTotalAmtResult,
    getRewardsCycleCountResult,
    getInflationAmtResult,
    getRewardsCycleSecondsResult,
    getRewardsEligibilityMinSecondsResult,
  ] = await Promise.all([
    getRewardsCycleStartTime,
    getRewardsCycleTotalAmt,
    getRewardsCycleCount,
    getInflationAmt,
    getRewardsCycleSeconds,
    getRewardsEligibilityMinSeconds,
  ]);

  const rewardsCycleStartTime = REWARDS_POOL_INTERFACE.decodeFunctionResult(
    "getRewardsCycleStartTime",
    getRewardsCycleStartTimeResult
  )[0] as BigNumber;
  const rewardsCycleTotalAmt = REWARDS_POOL_INTERFACE.decodeFunctionResult(
    "getRewardsCycleTotalAmt",
    getRewardsCycleTotalAmtResult
  )[0] as BigNumber;
  const rewardsCycleCount = REWARDS_POOL_INTERFACE.decodeFunctionResult(
    "getRewardsCycleCount",
    getRewardsCycleCountResult
  )[0] as BigNumber;
  const inflationAmt = REWARDS_POOL_INTERFACE.decodeFunctionResult(
    "getInflationAmt",
    getInflationAmtResult
  )[0] as BigNumber;
  const rewardsCycleSeconds = PROTOCOL_DAO_INTERFACE.decodeFunctionResult(
    "getRewardsCycleSeconds",
    getRewardsCycleSecondsResult
  )[0] as BigNumber;
  const rewardsEligibilityMinSeconds =
    PROTOCOL_DAO_INTERFACE.decodeFunctionResult(
      "getRewardsEligibilityMinSeconds",
      getRewardsEligibilityMinSecondsResult
    )[0] as BigNumber;

  const rewardsCycleEndTime = rewardsCycleStartTime.add(rewardsCycleSeconds);
  const rewardsEligibilityTime = rewardsCycleStartTime.add(
    rewardsEligibilityMinSeconds
  );

  return {
    rewardsCycleStartTime,
    rewardsCycleSeconds,
    rewardsCycleEndTime,
    rewardsCycleTotalAmt,
    rewardsCycleCount,
    inflationAmt,
    rewardsEligibilityMinSeconds,
    rewardsEligibilityTime,
  };
};

const sendRewardsMessage = async (type: RewardsType) => {
  if (type === RewardsType.NONE) return;
  const rewardsInformation = await getRewardsInformation();
  if (type === RewardsType.NEW_REWARDS_CYCLE) {
    await emitter.emit(REWARDS_NEW_CYCLE_TEMPLATE(rewardsInformation));
  } else if (type === RewardsType.ELIGIBILITY_REMINDER) {
    await emitter.emit(
      REWARDS_ELIGIBILITY_REMINDER_TEMPLATE(rewardsInformation)
    );
  } else if (type === RewardsType.CYCLE_ENDING_REMINDER) {
    await emitter.emit(REWARDS_ENDING_REMINDER_TEMPLATE(rewardsInformation));
  } else {
    throw new Error("Invalid rewards type");
  }
};

export enum RewardsType {
  NEW_REWARDS_CYCLE = "NEW_REWARDS_CYCLE",
  ELIGIBILITY_REMINDER = "ELIGIBILITY_REMINDER",
  CYCLE_ENDING_REMINDER = "CYCLE_ENDING_REMINDER",
  NONE = "NONE",
}

const getRewardsType = async (
  time: Date,
  rewardsInformation: RewardsInformation,
  context: Context
): Promise<RewardsType> => {
  console.log(time);
  const now = Math.ceil(time.getTime() / 1000);
  const cycle = rewardsInformation.rewardsCycleCount.toNumber();

  /* 
    Notify for new cycle
    when? asap when new cycle starts
  */

  const hasNotifiedForNewCycle =
    (await context.storage.getNumber(RewardsType.NEW_REWARDS_CYCLE)) === cycle;
  const shouldNotifyForNewCycle =
    rewardsInformation.rewardsCycleStartTime.lt(now) &&
    rewardsInformation.rewardsEligibilityTime.sub(7 * 24 * 60 * 60).gt(now);
  if (!hasNotifiedForNewCycle && shouldNotifyForNewCycle) {
    console.log("new cycle");
    await context.storage.putNumber(RewardsType.NEW_REWARDS_CYCLE, cycle);
    return RewardsType.NEW_REWARDS_CYCLE;
  }

  /*
    Notify for eligibility ending
    when? 7 days before the end of eligibility
  */
  const hasNotifiedForEligibility =
    (await context.storage.getNumber(RewardsType.ELIGIBILITY_REMINDER)) ===
    cycle;
  const shouldNotifyForEligibility =
    rewardsInformation.rewardsEligibilityTime.sub(7 * 24 * 60 * 60).lt(now) &&
    rewardsInformation.rewardsEligibilityTime.gt(now);
  if (!hasNotifiedForEligibility && shouldNotifyForEligibility) {
    await context.storage.putNumber(RewardsType.ELIGIBILITY_REMINDER, cycle);
    return RewardsType.ELIGIBILITY_REMINDER;
  }

  /*
    Notify for cycle ending
    when? 3 days before the end of cycle
  */
  const hasNotifiedForCycleEnding =
    (await context.storage.getNumber(RewardsType.CYCLE_ENDING_REMINDER)) ===
    cycle;
  const shouldNotifyForCycleEnding =
    rewardsInformation.rewardsCycleEndTime.sub(3 * 24 * 60 * 60).lt(now) &&
    rewardsInformation.rewardsCycleEndTime.gt(now);
  if (!hasNotifiedForCycleEnding && shouldNotifyForCycleEnding) {
    await context.storage.putNumber(RewardsType.CYCLE_ENDING_REMINDER, cycle);
    return RewardsType.CYCLE_ENDING_REMINDER;
  }
  return RewardsType.NONE;
};

export const checkRewardsPeriodic = async (context: Context, event: Event) => {
  await initServices(context);
  const { time } = event as PeriodicEvent;
  const rewardsInformation = await getRewardsInformation();
  return await sendRewardsMessage(
    await getRewardsType(time, rewardsInformation, context)
  );
};

export const rewardsEvent = async (context: Context, event:Event)=>{
  await initServices(context);
  const transactionEvent = event as TransactionEvent
  return transactionEvent;
}
