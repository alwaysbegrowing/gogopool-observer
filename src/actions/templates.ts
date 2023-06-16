import { TransactionEvent } from "@tenderly/actions";
import { formatDistance } from "date-fns";
import {
  APIEmbedField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { BigNumber, utils } from "ethers";
import { nodeHexToID } from "./utils";
import hash from "hash-emoji";

export const getEmojiAddress = (address: string) => {
  return `${hash(address)} ${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getEmojiNodeId = (address: string) => {
  const emoji = hash(address);
  const nodeId = nodeHexToID(address);
  return `${emoji} ${nodeId.slice(0, 11)}...${nodeId.slice(-4)}`;
};

const pilotComponent = (owner: string) => {
  return new ButtonBuilder()
    .setEmoji("🧑‍✈️")
    .setLabel("Pilot")
    .setURL(`https://snowtrace.io/address/${owner}`)
    .setStyle(ButtonStyle.Link);
};

const balloonComponent = (nodeId: string) => {
  return new ButtonBuilder()
    .setEmoji("🎈")
    .setLabel("Balloon")
    .setURL(`https://avascan.info/staking/validator/${nodeHexToID(nodeId)}`)
    .setStyle(ButtonStyle.Link);
};

const liquidStakerComponent = (owner: string) => {
  return new ButtonBuilder()
    .setEmoji("🌊")
    .setLabel("Liquid Staker")
    .setURL(`https://snowtrace.io/address/${owner}`)
    .setStyle(ButtonStyle.Link);
};

const transactionComponent = (transactionHash: string) => {
  return new ButtonBuilder()
    .setEmoji("📝")
    .setLabel("Transaction")
    .setURL(`https://snowtrace.io/tx/${transactionHash}`)
    .setStyle(ButtonStyle.Link);
};

const pilotField = (
  owner: string,
  options?: Partial<APIEmbedField>
): APIEmbedField => {
  return {
    name: "🧑‍✈️ pilot",
    value: getEmojiAddress(utils.getAddress(owner)),
    inline: true,
    ...options,
  };
};

const balloonField = (nodeId: string): APIEmbedField => {
  return {
    name: "🎈 balloon",
    value: getEmojiNodeId(nodeId),
    inline: true,
  };
};

const tripDurationField = (duration: string): APIEmbedField => {
  const now = new Date();
  return {
    name: "📅 trip duration",
    value: `${formatDistance(
      now,
      new Date(now.getTime() + parseInt(duration) * 1000),
      {
        addSuffix: false,
      }
    )}`,
    inline: true,
  };
};

const endTimeField = (endTime: string): APIEmbedField => {
  return {
    name: "🕰️ return",
    value: `${new Date(parseInt(endTime) * 1000).toLocaleString()}`,
    inline: true,
  };
};

const minipoolStatusField = (minipoolStatus: string): APIEmbedField => {
  return {
    name: "status",
    value: `${minipoolStatus}`,
    inline: true,
  };
};

const ggpAmountField = (
  amount: BigNumber,
  options?: Partial<APIEmbedField>
): APIEmbedField => {
  return {
    name: "amount",
    value: `${Number(utils.formatUnits(amount, 18)).toLocaleString()} GGP`,
    inline: true,
    ...options,
  };
};

const differenceField = (
  tokenName: string,
  difference: BigNumber,
  total: BigNumber,
  subtraction?: boolean,
  options?: Partial<APIEmbedField>
) => {
  const oldTotal = subtraction ? total.add(difference) : total.sub(difference);
  const differenceString = `${Number(
    utils.formatUnits(oldTotal, 18)
  ).toLocaleString()} ${tokenName} ${subtraction ? "-" : "+"} ${Number(
    utils.formatUnits(difference, 18)
  ).toLocaleString()} ${tokenName} = ${Number(
    utils.formatUnits(total, 18)
  ).toLocaleString()} ${tokenName}`;

  return {
    name: "amount",
    value: differenceString,
    ...options,
  };
};

const ggpDifferenceField = (
  difference: BigNumber,
  total: BigNumber,
  subtraction?: boolean,
  options?: Partial<APIEmbedField>
) => {
  return differenceField("GGP", difference, total, subtraction, options);
};

const avaxDifferenceField = (
  difference: BigNumber,
  total: BigNumber,
  subtraction?: boolean,
  options?: Partial<APIEmbedField>
) => {
  return differenceField("AVAX", difference, total, subtraction, options);
};

const avaxAmountField = (
  amount: BigNumber,
  options?: Partial<APIEmbedField>
): APIEmbedField => {
  return {
    name: "amount",
    value: `${Number(utils.formatUnits(amount, 18)).toLocaleString("en-us", {
      minimumFractionDigits: 4,
    })} AVAX`,
    inline: true,
    ...options,
  };
};

const ggAvaxAmountField = (
  amount: BigNumber,
  options?: Partial<APIEmbedField>
): APIEmbedField => {
  return {
    name: "amount",
    value: `${Number(utils.formatUnits(amount, 18)).toLocaleString("en-us", {
      minimumFractionDigits: 4,
    })} ggAVAX`,
    inline: true,
    ...options,
  };
};

const liquidStakerField = (
  owner: string,
  options?: Partial<APIEmbedField>
): APIEmbedField => {
  return {
    name: "🌊 liquid staker",
    value: getEmojiAddress(utils.getAddress(owner)),
    inline: true,
    ...options,
  };
};

export const MINIPOOL_PRELAUNCH_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string,
  endTime: string
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        balloonComponent(nodeId),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("🌄  Preparing for Takeoff")
        .setDescription(
          "A minipool is getting ready for a remarkable ride. Node Operator has deposited 1,000 AVAX and is now waiting on liquid staking fuel.\n[📄 the life of a minipool](https://docs.gogopool.com/design/how-minipools-work/the-life-of-a-minipool) [📄 minipool statuses](https://docs.gogopool.com/design/how-minipools-work/minipooldesign)"
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration),
          minipoolStatusField("prelaunch")
        )

        .setColor(0x7ddbd5)
        .setFooter({
          text: "[minipool status change] • prelaunch",
        }),
    ],
  };
};

export const MINIPOOL_LAUNCH_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string,
  endTime: string
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        balloonComponent(nodeId),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("🚀  Inflated and... Lift-off")
        .setDescription(
          "Hooray! Matched with liquid staker funds, this minipool has fully inflated, and the pilot has climbed aboard. It appears to be raising up up up. Let's hope for a smooth flight.\n[📄 the life of a minipool](https://docs.gogopool.com/design/how-minipools-work/the-life-of-a-minipool) [📄 minipool statuses](https://docs.gogopool.com/design/how-minipools-work/minipooldesign)"
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration),
          minipoolStatusField("launched")
        )

        .setColor(0x7ddbd5)
        .setFooter({ text: "[minipool status change] • launched" }),
    ],
  };
};

export const MINIPOOL_STAKING_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string,
  endTime: string
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        balloonComponent(nodeId),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("⛅  Approached Cruising Altitude")
        .setDescription(
          "Actively validating and discovering rewards, the minipool floats through the staking skies. It will remain in this lofty state until it's time to land.\n[📄 the life of a minipool](https://docs.gogopool.com/design/how-minipools-work/the-life-of-a-minipool) [📄 minipool statuses](https://docs.gogopool.com/design/how-minipools-work/minipooldesign)"
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration),
          endTimeField(endTime),
          minipoolStatusField("staking")
        )

        .setColor(0x7ddbd5)
        .setFooter({ text: "[minipool status change] • staking" }),
    ],
  };
};

export const MINIPOOL_WITHDRAWABLE_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string,
  endTime: string
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        balloonComponent(nodeId),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("🌎  Return to Earth")
        .setDescription(
          "A minipool ripe with rewards descends, and the time has come to collect the treasures we've found in the sky. Prepare for a gentle glide back to the ground.\n[📄 the life of a minipool](https://docs.gogopool.com/design/how-minipools-work/the-life-of-a-minipool) [📄 minipool statuses](https://docs.gogopool.com/design/how-minipools-work/minipooldesign)"
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration),
          minipoolStatusField("withdrawable")
        )

        .setColor(0x7ddbd5)
        .setFooter({ text: "[minipool status change] • withdrawable" }),
    ],
  };
};

export const MINIPOOL_FINISHED_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string,
  endTime: string
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        balloonComponent(nodeId),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("🎉  Celebrating Success")
        .setDescription(
          "A completed and enchanting adventure among the clouds. The minipool is deflated, tokens collected, and memories cherished. Farewell, until we see you again in the staking skies!\n[📄 the life of a minipool](https://docs.gogopool.com/design/how-minipools-work/the-life-of-a-minipool) [📄 minipool statuses](https://docs.gogopool.com/design/how-minipools-work/minipooldesign)"
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration),
          endTimeField(endTime),
          minipoolStatusField("finished")
        )

        .setColor(0x7ddbd5)
        .setFooter({ text: "[minipool status change] • finished" }),
    ],
  };
};

export const MINIPOOL_CANCELED_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string,
  endTime: string
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        balloonComponent(nodeId),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("⚠️  A Hasty Halt to our Hovering")
        .setDescription(
          "Alas, this minipool's journey has been called off. Heading back to terra firma, tokens in tow. A new adventure awaits, as a new flight awaits.\n[📄 the life of a minipool](https://docs.gogopool.com/design/how-minipools-work/the-life-of-a-minipool) [📄 minipool statuses](https://docs.gogopool.com/design/how-minipools-work/minipooldesign)"
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration),
          endTimeField(endTime),
          minipoolStatusField("canceled")
        )

        .setColor(0x33b6ae)
        .setFooter({ text: "[minipool status change] • canceled" }),
    ],
  };
};

export const MINIPOOL_ERROR_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string,
  endTime: string
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        balloonComponent(nodeId),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("❗  Mid-Air Mishap")
        .setDescription(
          "Oh dear, it seems the minipool has encountered a hiccup! Fear not, for we shall set things right and resume our whimsical wanderings through the staking skies.\n[📄 the life of a minipool](https://docs.gogopool.com/design/how-minipools-work/the-life-of-a-minipool) [📄 minipool statuses](https://docs.gogopool.com/design/how-minipools-work/minipooldesign)"
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration),
          endTimeField(endTime),
          minipoolStatusField("error")
        )

        .setColor(0x33b6ae)
        .setFooter({ text: "[minipool status change] • error" }),
    ],
  };
};

export const MINIPOOL_RESTAKE_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string,
  endTime: string
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        balloonComponent(nodeId),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("♻️  Another Adventure Begins")
        .setDescription(
          "The minipool has completed it's flight and is going out for another. Enjoy the ride!\n[📄 the life of a minipool](https://docs.gogopool.com/design/how-minipools-work/the-life-of-a-minipool) [📄 minipool statuses](https://docs.gogopool.com/design/how-minipools-work/minipooldesign)"
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration),
          minipoolStatusField("finished -> prelaunch -> launched")
        )
        .setColor(0x7ddbd5)
        .setFooter({ text: "[minipool status change] • launched" }),
    ],
  };
};

export const GGP_STAKING_STAKE_TEMPLATE = (
  transactionEvent: TransactionEvent,
  owner: string,
  amount: BigNumber,
  totalStake: BigNumber,
  isNodeOperator: boolean
) => {
  const stakingMessage = (isNodeOperator: boolean) =>
    isNodeOperator
      ? "A Node Operator has staked GGP to their minipool(s)."
      : "Someone has staked GGP.";

  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("⬆️  GGP Onboarded.")
        .setDescription(
          `${stakingMessage(
            isNodeOperator
          )}\n[📄 GGP rewards](https://docs.gogopool.com/design/how-minipools-work/ggp-rewards)`
        )
        .addFields(
          pilotField(owner),
          ggpAmountField(amount, {
            name: "stake amount",
          }),
          ggpDifferenceField(amount, totalStake, false, {
            name: "total stake",
          })
        )
        .setColor(0xcb92d9)
        .setFooter({ text: "[staking] • stake" }),
    ],
  };
};

export const GGP_STAKING_WITHDRAW_TEMPLATE = (
  transactionEvent: TransactionEvent,
  owner: string,
  amount: BigNumber,
  totalStake: BigNumber,
  isNodeOperator: boolean
) => {
  const unstakingMessage = (isNodeOperator: boolean) =>
    isNodeOperator
      ? "A Node Operator has unstaked GGP from their minipool(s)."
      : "Someone has unstaked GGP.";
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("⬇️  GGP Dropped Overboard.")
        .setDescription(
          `${unstakingMessage(
            isNodeOperator
          )}.\n[📄 GGP rewards](https://docs.gogopool.com/design/how-minipools-work/ggp-rewards)`
        )
        .addFields(
          pilotField(owner, { inline: false }),
          ggpAmountField(amount, {
            name: "un-stake amount",
          }),
          ggpDifferenceField(amount, totalStake, true, {
            name: "total stake",
          })
        )
        .setColor(0xa849c0)
        .setFooter({ text: "[staking] • withdraw" }),
    ],
  };
};

export const GGAVAX_DEPOSIT_TEMPLATE = (
  transactionEvent: TransactionEvent,
  assets: BigNumber,
  shares: BigNumber,
  amountAvailableForStaking: BigNumber
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        liquidStakerComponent(transactionEvent.from),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("⬆️ AVAX Fuel Added.")
        .setDescription(
          "AVAX has been deposited to the liquid staking pool and shares of ggAVAX have been minted.\n[📄 liquid staking](https://docs.gogopool.com/design/how-liquid-staking-works)"
        )
        .addFields(
          liquidStakerField(transactionEvent.from, { inline: false }),
          avaxAmountField(assets, { name: "amount deposited", inline: true }),
          ggAvaxAmountField(shares, { name: "shares minted" }),
          avaxDifferenceField(assets, amountAvailableForStaking, false, {
            name: "available for staking",
          })
        )
        .setColor(0x8aa0d1)
        .setFooter({ text: "[ggAVAX] • deposit" }),
    ],
  };
};

export const GGAVAX_WITHDRAW_TEMPLATE = (
  transactionEvent: TransactionEvent,
  assets: BigNumber,
  shares: BigNumber,
  amountAvailableForStaking: BigNumber
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        liquidStakerComponent(transactionEvent.from),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("⬇️ AVAX Fuel Drained.")
        .setDescription(
          "AVAX has been withdrawn from the liquid staking pool and shares of ggAVAX have been burned.\n[📄 liquid staking](https://docs.gogopool.com/design/how-liquid-staking-works)"
        )
        .addFields(
          liquidStakerField(transactionEvent.from, { inline: false }),
          ggAvaxAmountField(shares, { name: "shares burned" }),
          avaxAmountField(assets, { name: "amount withdrawn" }),
          avaxDifferenceField(assets, amountAvailableForStaking, true, {
            name: "available for staking",
          })
        )
        .setColor(0x4363aa)
        .setFooter({ text: "[ggAVAX] • withdraw" }),
    ],
  };
};
