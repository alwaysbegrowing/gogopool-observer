import { Context, Event, TransactionEvent } from "@tenderly/actions";
import {
  MINIPOOL_MANAGER_ADDRESS,
  MINIPOOL_MANAGER_INTERFACE,
} from "./constants";
import { discordClient } from "./discord";
import {
  MINIPOOL_CANCELED_TEMPLATE,
  MINIPOOL_ERROR_TEMPLATE,
  MINIPOOL_FINISHED_TEMPLATE,
  MINIPOOL_LAUNCH_TEMPLATE,
  MINIPOOL_PRELAUNCH_TEMPLATE,
  MINIPOOL_RESTAKE_TEMPLATE,
  MINIPOOL_STAKING_TEMPLATE,
  MINIPOOL_WITHDRAWABLE_TEMPLATE,
} from "./templates";
import { getMatchingEvents } from "./logParsing";
import { MinipoolStatus, MinipoolStatusChanged } from "./types";
import { jsonRpcProvider } from "./ethers";
import { WebhookMessageCreateOptions } from "discord.js";

export const getMinipoolDataFromNodeId = async (nodeID: string) => {
  const minipool = await jsonRpcProvider.getProvider().call({
    to: MINIPOOL_MANAGER_ADDRESS,
    data: MINIPOOL_MANAGER_INTERFACE.encodeFunctionData("getMinipoolByNodeID", [
      nodeID,
    ]),
  });
  const { owner, duration } = MINIPOOL_MANAGER_INTERFACE.decodeFunctionResult(
    "getMinipoolByNodeID",
    minipool
  )[0];
  return { owner, duration };
};

const getMessageFromStatusChangedEvent = async (
  statusChangedEvent: MinipoolStatusChanged,
  transactionEvent: TransactionEvent,
  status?: MinipoolStatus
): Promise<WebhookMessageCreateOptions> => {
  const { nodeID } = statusChangedEvent;
  if (!status) {
    status = statusChangedEvent.status.toString() as MinipoolStatus;
  }
  const { owner, duration } = await getMinipoolDataFromNodeId(nodeID);
  switch (status.toString()) {
    case MinipoolStatus.PRELAUNCH:
      return MINIPOOL_PRELAUNCH_TEMPLATE(
        transactionEvent,
        nodeID,
        transactionEvent.from,
        duration
      );
    case MinipoolStatus.LAUNCH:
      return MINIPOOL_LAUNCH_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration
      );

    case MinipoolStatus.STAKING:
      return MINIPOOL_STAKING_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration
      );

    case MinipoolStatus.WITHDRAWABLE:
      return MINIPOOL_WITHDRAWABLE_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration
      );

    case MinipoolStatus.ERROR:
      return MINIPOOL_ERROR_TEMPLATE(transactionEvent, nodeID, owner, duration);

    case MinipoolStatus.CANCELED:
      return MINIPOOL_CANCELED_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration
      );

    case MinipoolStatus.FINISHED:
      return MINIPOOL_FINISHED_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration
      );

    case MinipoolStatus.RESTAKE:
      return MINIPOOL_RESTAKE_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration
      );

    default:
      throw new Error("unknown status");
  }
};

export const minipoolStatusChange = async (context: Context, event: Event) => {
  discordClient.init(await context.secrets.get("MANGO_WEBHOOK_URL"));
  jsonRpcProvider.init(await context.secrets.get("JSON_RPC_URL"));
  const transactionEvent = event as TransactionEvent;
  
  const statusChangedEvents = getMatchingEvents<MinipoolStatusChanged>(
    transactionEvent,
    MINIPOOL_MANAGER_INTERFACE,
    "MinipoolStatusChanged"
  );
  let message;
  if (statusChangedEvents.length === 0) {
    throw new Error("status event not found");
  } else if (statusChangedEvents.length === 1) {
    message = await getMessageFromStatusChangedEvent(
      statusChangedEvents[0],
      transactionEvent
    );
  } else {
    // Only special case I know now is restake
    message = await getMessageFromStatusChangedEvent(
      statusChangedEvents[1],
      transactionEvent,
      MinipoolStatus.RESTAKE
    );
  }
  if (!message) {
    throw new Error("message not found");
  }
  await discordClient.sendMessage(message);
};
