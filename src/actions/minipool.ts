import { Context, Event, TransactionEvent } from "@tenderly/actions";
import { MINIPOOL_MANAGER_INTERFACE } from "./constants";
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

export const minipoolStatusChange = async (context: Context, event: Event) => {
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
    const statusChangedEvent = statusChangedEvents[0];
    switch (statusChangedEvent.status.toString()) {
      case "0":
        message = MINIPOOL_PRELAUNCH_TEMPLATE(
          transactionEvent,
          statusChangedEvent
        );
        break;
      case "1":
        message = MINIPOOL_LAUNCH_TEMPLATE(
          transactionEvent,
          statusChangedEvent
        );
        break;
      case "2":
        message = MINIPOOL_STAKING_TEMPLATE(
          transactionEvent,
          statusChangedEvent
        );
        break;
      case "3":
        message = MINIPOOL_WITHDRAWABLE_TEMPLATE(
          transactionEvent,
          statusChangedEvent
        );
        break;
    }
  } else {
    message = MINIPOOL_RESTAKE_TEMPLATE(
      transactionEvent,
      statusChangedEvents[0]
    );
  }

  await sendWebhook(await context.secrets.get("MANGO_WEBHOOK_URL"), message);
};
