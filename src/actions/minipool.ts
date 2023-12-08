import { Context, Event, TransactionEvent } from "@tenderly/actions";
import {
  MINIPOOL_MANAGER_ADDRESS,
  MINIPOOL_MANAGER_INTERFACE,
  MINIPOOL_STREAMLINER_INTERFACE,
} from "./constants";
import {
  MINIPOOL_CANCELED_TEMPLATE,
  MINIPOOL_ERROR_TEMPLATE,
  MINIPOOL_FINISHED_TEMPLATE,
  MINIPOOL_LAUNCH_TEMPLATE,
  MINIPOOL_PRELAUNCH_TEMPLATE,
  MINIPOOL_RESTAKE_TEMPLATE,
  MINIPOOL_STAKING_TEMPLATE,
  MINIPOOL_STREAMLINE_TEMPLATE,
  MINIPOOL_WITHDRAWABLE_TEMPLATE,
} from "./templates";
import { getMatchingEvents } from "./logParsing";
import { Minipool, MinipoolStatus, MinipoolStatusChanged } from "./types";
import { jsonRpcProvider } from "./ethers";
import { WebhookMessageCreateOptions } from "discord.js";
import { initServices } from "./utils";
import { emitter } from "./emitter";

export const getMinipoolDataFromNodeId = async (
  nodeID: string
): Promise<Minipool> => {
  const minipoolCallResult = await jsonRpcProvider.getProvider().call({
    to: MINIPOOL_MANAGER_ADDRESS,
    data: MINIPOOL_MANAGER_INTERFACE.encodeFunctionData("getMinipoolByNodeID", [
      nodeID,
    ]),
  });
  const minipoolResult = MINIPOOL_MANAGER_INTERFACE.decodeFunctionResult(
    "getMinipoolByNodeID",
    minipoolCallResult
  )[0];
  return minipoolResult;
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
  const { owner, duration, startTime } = await getMinipoolDataFromNodeId(
    nodeID
  );
  switch (status.toString()) {
    case MinipoolStatus.PRELAUNCH:
      return MINIPOOL_PRELAUNCH_TEMPLATE(
        transactionEvent,
        nodeID,
        transactionEvent.from,
        duration.toString()
      );
    case MinipoolStatus.LAUNCH:
      return MINIPOOL_LAUNCH_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration.toString(),
        startTime.add(duration).toString()
      );

    case MinipoolStatus.STAKING:
      return MINIPOOL_STAKING_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration.toString(),
        startTime.add(duration).toString()
      );

    case MinipoolStatus.WITHDRAWABLE:
      return MINIPOOL_WITHDRAWABLE_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration.toString(),
        startTime.add(duration).toString()
      );

    case MinipoolStatus.ERROR:
      return MINIPOOL_ERROR_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration.toString(),
        startTime.add(duration).toString()
      );

    case MinipoolStatus.CANCELED:
      return MINIPOOL_CANCELED_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration.toString(),
        startTime.add(duration).toString()
      );

    case MinipoolStatus.FINISHED:
      return MINIPOOL_FINISHED_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration.toString(),
        startTime.add(duration).toString()
      );

    case MinipoolStatus.RESTAKE:
      return MINIPOOL_RESTAKE_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration.toString(),
        startTime.add(duration).toString()
      );

    case MinipoolStatus.STREAMLINE_PRELAUNCH:
      return MINIPOOL_STREAMLINE_TEMPLATE(
        transactionEvent,
        nodeID,
        owner,
        duration.toString()
      );

    default:
      throw new Error("unknown status");
  }
};

export const minipoolStatusChange = async (context: Context, event: Event) => {
  await initServices(context);
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
    const hasNewStreamlinedMinipoolMadeEvent =
      getMatchingEvents<MinipoolStatusChanged>(
        transactionEvent,
        MINIPOOL_STREAMLINER_INTERFACE,
        "NewStreamlinedMinipoolMade"
      )?.length > 0;
    if (hasNewStreamlinedMinipoolMadeEvent) {
      message = await getMessageFromStatusChangedEvent(
        statusChangedEvents[0],
        transactionEvent,
        MinipoolStatus.STREAMLINE_PRELAUNCH
      );
    } else {
      message = await getMessageFromStatusChangedEvent(
        statusChangedEvents[0],
        transactionEvent
      );
    }
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
  await emitter.emit(message);
};
