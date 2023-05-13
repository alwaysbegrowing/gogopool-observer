import { isDev } from "./constants";
import axios from "axios";
import hash from "hash-emoji";
import { nodeHexToID } from "./utils";
import { ethers } from "ethers";
import { formatDistance } from "date-fns";

export const getEmojiAddress = (address: string) => {
  return `${hash(address)} ${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getEmojiNodeId = (address: string) => {
  const emoji = hash(address);
  const nodeId = nodeHexToID(address);
  return `${emoji} ${nodeId.slice(0, 11)}...${nodeId.slice(-4)}`;
};

const commonFields = (nodeId: string, minipoolOwner: string) => {
  console.log(minipoolOwner);

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
  nodeId: string,
  minipoolOwner: string
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "A minipool is getting ready.",
        fields: [...commonFields(nodeId, minipoolOwner)],
      },
    ],
  };
};

export const MINIPOOL_LAUNCH_TEMPLATE = (
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

export const MINIPOOL_STAKING_TEMPLATE = (nodeId: string, owner: string) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "We have liftoff!",
        fields: [...commonFields(nodeId, owner)],
      },
    ],
  };
};

export const MINIPOOL_WITHDRAWABLE_TEMPLATE = (
  nodeId: string,
  owner: string
) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool is ready to be withdrawn!",
        fields: [...commonFields(nodeId, owner)],
      },
    ],
  };
};

export const MINIPOOL_RESTAKE_TEMPLATE = (nodeId: string, owner: string) => {
  return {
    username: "GoGoObserver 🎈🔭",
    embeds: [
      {
        title: "Minipool has ended it's flight and restaked!",
        fields: [...commonFields(nodeId, owner)],
      },
    ],
  };
};

export const sendWebhook = async (webhookUrl: string, messageToSend: any) => {
  !isDev
    ? console.log(messageToSend)
    : await axios.post(webhookUrl, messageToSend);
};
