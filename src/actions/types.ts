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

export interface AVAXDeposited extends Event {
  by: string;
  amount: BigNumber;
}
