import { Log, TransactionEvent } from "@tenderly/actions";
import { Interface } from "ethers/lib/utils";
import {
  TOKEN_GGAVAX_INTERFACE,
  STAKING_INTERFACE,
  GGP_VAULT_INTERFACE,
} from "./constants";
import {
  DepositedFromStaking,
  GGAVAXDeposit,
  GGAVAXWithdraw,
  GGPCapUpdated,
  GGPStaked,
  GGPWithdrawn,
  TargetAPRUpdated,
  WithdrawnForStaking,
  XGGPDeposit,
  XGGPWithdraw,
} from "./types";

export const getMatchingEvent = <Type>(
  transactionEvent: TransactionEvent,
  iface: Interface,
  eventName: string
): Type => {
  const event = getMatchingEvents<Type>(
    transactionEvent,
    iface,
    eventName
  ).pop();
  if (!event) throw new Error("No matching event found");
  return event;
};

export const getMatchingEvents = <Type>(
  transactionEvent: TransactionEvent,
  iface: Interface,
  eventName: string
): Type[] => {
  const matchingLogs = transactionEvent.logs.filter((log: Log) => {
    try {
      const possibleEvent = iface.parseLog(log);
      return possibleEvent.name === eventName;
    } catch (e) {
      return false;
    }
  });
  return matchingLogs.map((log) => {
    const event = iface.parseLog(log);
    return {
      ...event.args,
      address: log.address,
    } as Type;
  });
};
export const getGgpStakedEvent = async (
  transactionEvent: TransactionEvent
): Promise<GGPStaked | undefined> => {
  try {
    return await getMatchingEvent<GGPStaked>(
      transactionEvent,
      STAKING_INTERFACE,
      "GGPStaked"
    );
  } catch (e) {
    return;
  }
};

export const getGgpWithdrawnEvent = async (
  transactionEvent: TransactionEvent
): Promise<GGPWithdrawn | undefined> => {
  try {
    return await getMatchingEvent<GGPWithdrawn>(
      transactionEvent,
      STAKING_INTERFACE,
      "GGPWithdrawn"
    );
  } catch (e) {
    return;
  }
};

export const getGgAvaxWithdrawEvent = async (
  transactionEvent: TransactionEvent
): Promise<GGAVAXWithdraw | undefined> => {
  try {
    return await getMatchingEvent<GGAVAXWithdraw>(
      transactionEvent,
      TOKEN_GGAVAX_INTERFACE,
      "Withdraw"
    );
  } catch (e) {
    return;
  }
};

export const getGgAvaxDepositEvent = async (
  transactionEvent: TransactionEvent
): Promise<GGAVAXDeposit | undefined> => {
  try {
    return await getMatchingEvent<GGAVAXDeposit>(
      transactionEvent,
      TOKEN_GGAVAX_INTERFACE,
      "Deposit"
    );
  } catch (e) {
    return;
  }
};

/*

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
*/

export const getXggpDepositEvent = async (
  transactionEvent: TransactionEvent
): Promise<XGGPDeposit | undefined> => {
  try {
    return await getMatchingEvent<XGGPDeposit>(
      transactionEvent,
      GGP_VAULT_INTERFACE,
      "Deposit"
    );
  } catch (e) {
    return;
  }
};

export const getXggpWithdrawEvent = async (
  transactionEvent: TransactionEvent
): Promise<XGGPWithdraw | undefined> => {
  try {
    return await getMatchingEvent<XGGPWithdraw>(
      transactionEvent,
      GGP_VAULT_INTERFACE,
      "Withdraw"
    );
  } catch (e) {
    return;
  }
};

export const getXggpCapUpdatedEvent = async (
  transactionEvent: TransactionEvent
): Promise<GGPCapUpdated | undefined> => {
  try {
    return await getMatchingEvent<GGPCapUpdated>(
      transactionEvent,
      GGP_VAULT_INTERFACE,
      "GGPCapUpdated"
    );
  } catch (e) {
    return;
  }
};

export const getTargetAPRUpdatedEvent = async (
  transactionEvent: TransactionEvent
): Promise<TargetAPRUpdated | undefined> => {
  try {
    return await getMatchingEvent<TargetAPRUpdated>(
      transactionEvent,
      GGP_VAULT_INTERFACE,
      "TargetAPRUpdated"
    );
  } catch (e) {
    return;
  }
};

export const getDepositedFromStakingEvent = async (
  transactionEvent: TransactionEvent
): Promise<DepositedFromStaking | undefined> => {
  try {
    return await getMatchingEvent<DepositedFromStaking>(
      transactionEvent,
      GGP_VAULT_INTERFACE,
      "DepositedFromStaking"
    );
  } catch (e) {
    return;
  }
};

export const getWithdrawnForStakingEvent = async (
  transactionEvent: TransactionEvent
): Promise<WithdrawnForStaking | undefined> => {
  try {
    return await getMatchingEvent<WithdrawnForStaking>(
      transactionEvent,
      GGP_VAULT_INTERFACE,
      "WithdrawnForStaking"
    );
  } catch (e) {
    return;
  }
};

export const getRewardsDistributedEvent = async (
  transactionEvent: TransactionEvent
): Promise<{ amount: string } | undefined> => {
  try {
    return await getMatchingEvent<{ amount: string }>(
      transactionEvent,
      GGP_VAULT_INTERFACE,
      "RewardsDistributed"
    );
  } catch (e) {
    return;
  }
};
