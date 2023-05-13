import { isDev } from "./constants";
import { MinipoolStatusChanged } from "./types";
import axios from "axios";
import { TransactionEvent } from "@tenderly/actions";
import hash from "hash-emoji";

export const getEmojiAddress = (address: string) => {
  return `${hash(address)} ${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const MINIPOOL_PRELAUNCH_TEMPLATE = (
  transactionEvent: TransactionEvent,
  minipoolStatusChangedEvent: MinipoolStatusChanged
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool [prelaunch]",
        fields: [...commonFields(transactionEvent, minipoolStatusChangedEvent)],
      },
    ],
  };
};

const commonFields = (
  transactionEvent: TransactionEvent,
  minipoolStatusChangedEvent: MinipoolStatusChanged
) => {
  return [
    {
      name: "pilot",
      value: `[${getEmojiAddress(
        transactionEvent.from
      )}](https://snowtrace.io/address/${transactionEvent.from})`,
      inline: true,
    },
    {
      name: "node ID",
      value: `[${getEmojiAddress(
        minipoolStatusChangedEvent.nodeID
      )}](https://snowtrace.io/address/${minipoolStatusChangedEvent.nodeID})`,
    },
  ];
};

export const MINIPOOL_LAUNCH_TEMPLATE = (
  transactionEvent: TransactionEvent,
  minipoolStatusChangedEvent: MinipoolStatusChanged
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool [launch]",
        fields: [...commonFields(transactionEvent, minipoolStatusChangedEvent)],
      },
    ],
  };
};

export const MINIPOOL_STAKING_TEMPLATE = (
  transactionEvent: TransactionEvent,
  minipoolStatusChangedEvent: MinipoolStatusChanged
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool [staking]",
        fields: [...commonFields(transactionEvent, minipoolStatusChangedEvent)],
      },
    ],
  };
};

export const MINIPOOL_WITHDRAWABLE_TEMPLATE = (
  transactionEvent: TransactionEvent,
  minipoolStatusChangedEvent: MinipoolStatusChanged
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool [withdrawable]",
        fields: [...commonFields(transactionEvent, minipoolStatusChangedEvent)],
      },
    ],
  };
};

export const MINIPOOL_RESTAKE_TEMPLATE = (
  transactionEvent: TransactionEvent,
  minipoolStatusChangedEvent: MinipoolStatusChanged
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool [restake]",
        fields: [...commonFields(transactionEvent, minipoolStatusChangedEvent)],
      },
    ],
  };
};

export const sendWebhook = async (webhookUrl: string, messageToSend: any) => {
  isDev
    ? console.log(messageToSend)
    : await axios.post(webhookUrl, messageToSend);
};
