import { Context, Event, TransactionEvent } from "@tenderly/actions";
import {
  MINIPOOL_MANAGER_ADDRESS,
  MINIPOOL_MANAGER_INTERFACE,
} from "./constants";
import {
  MINIPOOL_LAUNCH_TEMPLATE,
  MINIPOOL_PRELAUNCH_TEMPLATE,
  MINIPOOL_RESTAKE_TEMPLATE,
  MINIPOOL_STAKING_TEMPLATE,
  MINIPOOL_WITHDRAWABLE_TEMPLATE,
  sendWebhook,
} from "./discord";
import { getMatchingEvents } from "./logParsing";
import { MinipoolStatusChanged } from "./types";
import { ethers } from "ethers";
export const getMinipoolDataFromNodeId = async (
  provider: ethers.providers.JsonRpcProvider,
  nodeID: string
) => {
  const minipool = await provider.call({
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
export const minipoolStatusChange = async (context: Context, event: Event) => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.avax.network/ext/bc/C/rpc"
  );
  const transactionEvent = event as TransactionEvent;
  const statusChangedEvents = await getMatchingEvents<MinipoolStatusChanged>(
    transactionEvent,
    MINIPOOL_MANAGER_INTERFACE,
    "MinipoolStatusChanged"
  );
  let message;
  if (statusChangedEvents.length === 0) {
    throw new Error("bond not found");
  } else if (statusChangedEvents.length === 1) {
    const { status, nodeID } = statusChangedEvents[0];
    switch (status.toString()) {
      case "0":
        message = MINIPOOL_PRELAUNCH_TEMPLATE(nodeID, transactionEvent.from);
        break;
      case "1": {
        const { owner, duration } = await getMinipoolDataFromNodeId(
          provider,
          nodeID
        );
        message = MINIPOOL_LAUNCH_TEMPLATE(nodeID, owner, duration);
        break;
      }
      case "2": {
        const { owner } = await getMinipoolDataFromNodeId(provider, nodeID);
        message = MINIPOOL_STAKING_TEMPLATE(nodeID, owner);
        break;
      }
      case "3": {
        const { owner } = await getMinipoolDataFromNodeId(provider, nodeID);
        message = MINIPOOL_WITHDRAWABLE_TEMPLATE(nodeID, owner);
        break;
      }
    }
  } else {
    const { nodeID } = statusChangedEvents[0];
    const { owner } = await getMinipoolDataFromNodeId(provider, nodeID);
    message = MINIPOOL_RESTAKE_TEMPLATE(nodeID, owner);
  }

  await sendWebhook(await context.secrets.get("MANGO_WEBHOOK_URL"), message);
};
