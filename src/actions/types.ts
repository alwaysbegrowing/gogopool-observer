import { BigNumber } from "ethers";

type Event = {
  address: string;
};

export interface TransferEvent extends Event {
  from: string;
  to: string;
  value: BigNumber;
}

export interface MinipoolStatusChanged extends Event {
  nodeID: string;
  status: BigNumber;
}

export interface GGPWithdrawn extends Event {
  to: string;
  amount: BigNumber;
}

export interface GGPStaked extends Event {
  from: string;
  amount: BigNumber;
}

export interface GGAVAXWithdraw extends Event {
  caller: string;
  receiver: string;
  owner: string;
  assets: BigNumber;
  shares: BigNumber;
}

export interface GGAVAXDeposit extends Event {
  caller: string;
  owner: string;
  assets: BigNumber;
  shares: BigNumber;
}

export interface XGGPDeposit extends Event {
  sender: string;
  owner: string;
  assets: BigNumber;
  shares: BigNumber;
}

export interface XGGPWithdraw extends Event {
  sender: string;
  receiver: string;
  owner: string;
  assets: BigNumber;
  shares: BigNumber;
}

export interface GGPCapUpdated extends Event {
  newMax: BigNumber;
}

export interface TargetAPRUpdated extends Event {
  newTargetAPR: BigNumber;
}

export interface WithdrawnForStaking extends Event {
  caller: string;
  assets: BigNumber;
}

export interface DepositedFromStaking extends Event {
  caller: string;
  amount: BigNumber;
}

export interface RewardsDistributed extends Event {
  amount: BigNumber;
}

export interface Withdrawl extends Event {
  src: string;
  wad: BigNumber;
}

export interface AVAXDeposited extends Event {
  by: string;
  amount: BigNumber;
}

export interface NewStreamlinedMinipoolMade extends Event {
  nodeID: string;
  owner: string;
  hardwareProviderContract: BigNumber;
}

export enum MinipoolStatus {
  PRELAUNCH = "0",
  LAUNCH = "1",
  STAKING = "2",
  WITHDRAWABLE = "3",
  FINISHED = "4",
  CANCELED = "5",
  ERROR = "6",
  STREAMLINE_PRELAUNCH = "10",
  STREAMLINE_RELAUNCH = "12",
  RESTAKE = "11",
}

export type Minipool = {
  index: BigNumber;
  nodeID: string;
  status: BigNumber;
  duration: BigNumber;
  delegationFee: BigNumber;
  owner: string;
  multisigAddr: string;
  avaxNodeOpAmt: BigNumber;
  avaxNodeOpInitialAmt: BigNumber;
  avaxLiquidStakerAmt: BigNumber;
  txID: string;
  creationTime: BigNumber;
  initialStartTime: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  avaxTotalRewardAmt: BigNumber;
  errorCode: string;
  ggpSlashAmt: BigNumber;
  avaxNodeOpRewardAmt: BigNumber;
  blsPubkeyAndSig: string;
  avaxLiquidStakerRewardAmt: BigNumber;
};

export type StakerInformation = {
  stakerAddr: string;
  avaxAssigned: BigNumber;
  avaxStaked: BigNumber;
  avaxValidating: BigNumber;
  avaxValidatingHighWater: BigNumber;
  ggpRewards: BigNumber;
  ggpStaked: BigNumber;
  lastRewardsCycleCompleted: BigNumber;
  rewardsStartTime: BigNumber;
  ggpLockedUntil: BigNumber;
};

export type GgAvaxInformation = {
  amountAvailableForStaking: BigNumber;
  stakingTotalAssets: BigNumber;
};

export type RewardsInformation = {
  rewardsCycleStartTime: BigNumber;
  rewardsCycleEndTime: BigNumber;
  rewardsCycleTotalAmt: BigNumber;
  rewardsCycleCount: BigNumber;
  inflationAmt: BigNumber;
  rewardsCycleSeconds: BigNumber;
  rewardsEligibilityMinSeconds: BigNumber;
  rewardsEligibilityTime: BigNumber;
};
