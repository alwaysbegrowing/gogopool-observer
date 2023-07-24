import { Log, TransactionEvent } from "@tenderly/actions";
import { Interface } from "ethers/lib/utils";
import { TOKEN_GGAVAX_INTERFACE, STAKING_INTERFACE } from "./constants";
import {
  GGAVAXDeposit,
  GGAVAXWithdraw,
  GGPStaked,
  GGPWithdrawn,
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
