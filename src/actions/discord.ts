import { isDev } from "./constants";
import axios from "axios";
import hash from "hash-emoji";
import { nodeHexToID } from "./utils";
import { ethers } from "ethers";
import { formatDistance } from "date-fns";
import { TransactionEvent } from "@tenderly/actions";

export const getEmojiAddress = (address: string) => {
  return `${hash(address)} ${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getEmojiNodeId = (address: string) => {
  const emoji = hash(address);
  const nodeId = nodeHexToID(address);
  return `${emoji} ${nodeId.slice(0, 11)}...${nodeId.slice(-4)}`;
};

const commonFields = (nodeId: string, minipoolOwner: string) => {
  return [
    {
      name: "🧑‍✈️ pilot",
      value: `[${getEmojiAddress(
        ethers.utils.getAddress(minipoolOwner)
      )}](https://snowtrace.io/address/${minipoolOwner})`,
      inline: true,
    },
    {
      name: "🎈 balloon",
      value: `[${getEmojiNodeId(
        nodeId
      )}](https://avascan.info/staking/validator/${nodeHexToID(nodeId)})`,
      inline: true,
    },
  ];
};
export const MINIPOOL_PRELAUNCH_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  minipoolOwner: string
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "A minipool is getting ready.",
        url: `https://snowtrace.io/tx/${transactionEvent.transactionHash}`,
        fields: [...commonFields(nodeId, minipoolOwner)],
        color: 0x5d43ef,
        description: "[prelaunch]",
      },
    ],
  };
};

export const MINIPOOL_LAUNCH_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  minipoolOwner: string,
  duration: string
) => {
  const now = new Date();
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool is ready!",
        url: `https://snowtrace.io/tx/${transactionEvent.transactionHash}`,
        color: 0x5d43ef,
        description: "[launched]",
        fields: [
          ...commonFields(nodeId, minipoolOwner),
          {
            name: "🕰️ trip duration",
            value: `${formatDistance(
              now,
              new Date(now.getTime() + parseInt(duration) * 1000),
              {
                addSuffix: false,
              }
            )}`,
            inline: false,
          },
        ],
      },
    ],
  };
};

export const MINIPOOL_STAKING_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "We have liftoff!",
        url: `https://snowtrace.io/tx/${transactionEvent.transactionHash}`,
        color: 0x5d43ef,
        description: "[staking]",
        fields: [...commonFields(nodeId, owner)],
      },
    ],
  };
};

export const MINIPOOL_WITHDRAWABLE_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool is ready to be withdrawn!",
        url: `https://snowtrace.io/tx/${transactionEvent.transactionHash}`,
        description: "[withdrawable]",
        color: 0x5d43ef,
        fields: [...commonFields(nodeId, owner)],
      },
    ],
  };
};

export const MINIPOOL_FINISHED_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool has finished it's flight.",
        url: `https://snowtrace.io/tx/${transactionEvent.transactionHash}`,
        description: "[finished]",
        color: 0x5d43ef,
        fields: [...commonFields(nodeId, owner)],
      },
    ],
  };
};

export const MINIPOOL_CANCELED_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool is grounded.",
        url: `https://snowtrace.io/tx/${transactionEvent.transactionHash}`,
        description: "[canceled]",
        color: 0x5d43ef,
        fields: [...commonFields(nodeId, owner)],
      },
    ],
  };
};

export const MINIPOOL_ERROR_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool has crashed.",
        url: `https://snowtrace.io/tx/${transactionEvent.transactionHash}`,
        description: "[error]",
        color: 0x5d43ef,
        fields: [...commonFields(nodeId, owner)],
      },
    ],
  };
};

export const MINIPOOL_RESTAKE_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool has ended it's flight and restaked!",
        url: `https://snowtrace.io/tx/${transactionEvent.transactionHash}`,
        description: "[withdrawable] • [prelaunch] • [launched]",
        color: 0x5d43ef,
        fields: [...commonFields(nodeId, owner)],
      },
    ],
  };
};

export const sendWebhook = async (webhookUrl: string, messageToSend: any) => {
  isDev
    ? console.log(messageToSend)
    : await axios.post(webhookUrl, messageToSend);
};
