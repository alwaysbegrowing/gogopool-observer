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

export interface Withdrawl extends Event {
  src: string;
  wad: BigNumber;
}

export interface AVAXDeposited extends Event {
  by: string;
  amount: BigNumber;
}

export enum MinipoolStatus {
  PRELAUNCH = "0",
  LAUNCH = "1",
  STAKING = "2",
  WITHDRAWABLE = "3",
  ERROR = "4",
  CANCELED = "5",
  FINISHED = "6",
  RESTAKE = "10",
}
