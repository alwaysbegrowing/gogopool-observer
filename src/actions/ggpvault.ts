import { Context, Event, TransactionEvent } from "@tenderly/actions";
import {
  getDepositedFromStakingEvent,
  getRewardsDistributedEvent,
  getTargetAPRUpdatedEvent,
  getWithdrawnForStakingEvent,
  getXggpCapUpdatedEvent,
  getXggpDepositEvent,
  getXggpWithdrawEvent,
} from "./logParsing";
import {
  XGGP_DEPOSIT_DISPLAY_TEMPLATE,
  XGGP_GGP_CAP_UPDATED_TEMPLATE,
  XGGP_STAKING_DEPOSIT_TEMPLATE,
  XGGP_STAKING_REWARD_TEMPLATE,
  XGGP_STAKING_WITHDRAW_TEMPLATE,
  XGGP_TARGET_APR_UPDATED_TEMPLATE,
  XGGP_WITHDRAW_DISPLAY_TEMPLATE,
} from "./templates";
import {
  DepositedFromStaking,
  GGPCapUpdated,
  RewardsDistributed,
  TargetAPRUpdated,
  WithdrawnForStaking,
  XGGPDeposit,
  XGGPWithdraw,
} from "./types";
import { initServices } from "./utils";
import { emitter } from "./emitter";

const handleXggpDepositEvent = async (
  transactionEvent: TransactionEvent,
  ggpDepositEvent: XGGPDeposit
) => {
  await emitter.emit(
    XGGP_DEPOSIT_DISPLAY_TEMPLATE(transactionEvent, ggpDepositEvent)
  );
};

const handleXggpWithdrawEvent = async (
  transactionEvent: TransactionEvent,
  ggpWithdrawnEvent: XGGPWithdraw
) => {
  const { assets, address } = ggpWithdrawnEvent;
  await emitter.emit(
    XGGP_WITHDRAW_DISPLAY_TEMPLATE(transactionEvent, assets, address)
  );
};

const handleXggpCapUpdatedEvent = async (capUpdatedEvent: GGPCapUpdated) => {
  const { newMax } = capUpdatedEvent;
  await emitter.emit(XGGP_GGP_CAP_UPDATED_TEMPLATE(newMax));
};

const handleXggpTargetAprUpdatedEvent = async (
  targetAprUpdatedEvent: TargetAPRUpdated
) => {
  const { newTargetAPR } = targetAprUpdatedEvent;
  await emitter.emit(XGGP_TARGET_APR_UPDATED_TEMPLATE(newTargetAPR));
};

const handleXggpStakingDepositEvent = async (
  stakingDepositEvent: DepositedFromStaking
) => {
  const { amount, caller } = stakingDepositEvent;
  await emitter.emit(XGGP_STAKING_DEPOSIT_TEMPLATE(amount, caller));
};

const handleXggpStakingWithdrawEvent = async (
  stakingWithdrawnEvent: WithdrawnForStaking
) => {
  const { assets, caller } = stakingWithdrawnEvent;
  await emitter.emit(XGGP_STAKING_WITHDRAW_TEMPLATE(assets, caller));
};

const handleXggpRewardsDistributedEvent = async (
  transactionEvent: TransactionEvent,
  rewardsDistributedEvent: RewardsDistributed
) => {
  const { amount } = rewardsDistributedEvent;
  await emitter.emit(
    XGGP_STAKING_REWARD_TEMPLATE(transactionEvent, amount)
  );
};

export const depositOrWithdraw = async (context: Context, event: Event) => {
  await initServices(context);
  const transactionEvent = event as TransactionEvent;

  const xggpDepositEvent = await getXggpDepositEvent(transactionEvent);
  if (xggpDepositEvent) {
    await handleXggpDepositEvent(transactionEvent, xggpDepositEvent);
  } else {
    const xggpWithdrawEvent = await getXggpWithdrawEvent(transactionEvent);
    if (!xggpWithdrawEvent) {
      throw new Error("No Withdraw or Deposit event found");
    }
    await handleXggpWithdrawEvent(transactionEvent, xggpWithdrawEvent);
  }
};

export const stateVariablesUpdated = async (context: Context, event: Event) => {
  await initServices(context);
  const transactionEvent = event as TransactionEvent;

  const capUpdatedEvent = await getXggpCapUpdatedEvent(transactionEvent);
  if (capUpdatedEvent) {
    await handleXggpCapUpdatedEvent(capUpdatedEvent);
  } else {
    const targetAprUpdatedEvent = await getTargetAPRUpdatedEvent(
      transactionEvent
    );
    if (!targetAprUpdatedEvent) {
      throw new Error("No Cap or Target APR event found");
    }
    await handleXggpTargetAprUpdatedEvent(targetAprUpdatedEvent);
  }
};
export const rewardsDistributed = async (context: Context, event: Event) => {
  await initServices(context);
  const transactionEvent = event as TransactionEvent;

  const rewardsDistributedEvent = await getRewardsDistributedEvent(
    transactionEvent
  );
  if (rewardsDistributedEvent) {
    await handleXggpRewardsDistributedEvent(
      transactionEvent,
      rewardsDistributedEvent
    );
  }
};

export const stakingTransactions = async (context: Context, event: Event) => {
  await initServices(context);
  const transactionEvent = event as TransactionEvent;

  const stakingDepositEvent = await getDepositedFromStakingEvent(
    transactionEvent
  );
  if (stakingDepositEvent) {
    await handleXggpStakingDepositEvent(stakingDepositEvent);
  } else {
    const stakingWithdrawEvent = await getWithdrawnForStakingEvent(
      transactionEvent
    );
    if (!stakingWithdrawEvent) {
      throw new Error("No Withdraw or Deposit event found");
    }
    await handleXggpStakingWithdrawEvent(stakingWithdrawEvent);
  }
};
