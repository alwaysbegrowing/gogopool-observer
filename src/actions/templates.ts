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
    name: "🕰️ trip duration",
    value: `${formatDistance(
      now,
      new Date(now.getTime() + parseInt(duration) * 1000),
      {
        addSuffix: false,
      }
    )}`,
    inline: false,
  };
};

const ggpAmountField = (
  amount: BigNumber,
  subtraction?: boolean
): APIEmbedField => {
  return {
    name: "💰 difference",
    value: `${subtraction ? "-" : "+"} ${Number(
      utils.formatUnits(amount, 18)
    ).toLocaleString()} GGP`,
    inline: true,
  };
};

const ggpTotalStakeField = (amount: BigNumber): APIEmbedField => {
  return {
    name: "💰 total stake",
    value: `${Number(utils.formatUnits(amount, 18)).toLocaleString()} GGP`,
    inline: true,
  };
};

const ggAvaxAmount = (
  amount: BigNumber,
  options?: Partial<APIEmbedField>
): APIEmbedField => {
  return {
    name: "💰 amount",
    value: `${Number(utils.formatUnits(amount, 18)).toLocaleString()} GGAVAX`,
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
  duration: string
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
          "A minipool is getting ready for a remarkable ride. Node Operator has deposited 1,000 AVAX, and is now waiting on more liquid staking fuel."
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration)
        )

        .setColor(0x33b6ae)
        .setFooter({
          text: "[prelaunch] • [prelaunch] • minipool status change",
        }),
    ],
  };
};

export const MINIPOOL_LAUNCH_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string
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
          "Hooray! Matched with liquid staker funds, this minipool has fully inflated, and the pilot has climbed aboard. It appears to be raising up up up. Let's hope for a smooth flight."
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration)
        )

        .setColor(0x33b6ae)
        .setFooter({ text: "[launched] • minipool status change" }),
    ],
  };
};

export const MINIPOOL_STAKING_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string
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
          "Actively staking and discovering rewards, the minipool floats through the staking skies. It will remain in this lofty state until it's time to land."
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration)
        )

        .setColor(0x33b6ae)
        .setFooter({ text: "[staking] • minipool status change" }),
    ],
  };
};

export const MINIPOOL_WITHDRAWABLE_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string
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
          "A minipool ripe with rewards descends, and the time has come to collect the treasures we've found in the sky. Prepare for a gentle glide back to the ground."
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration)
        )

        .setColor(0x33b6ae)
        .setFooter({ text: "[withdrawable] • minipool status change" }),
    ],
  };
};

export const MINIPOOL_FINISHED_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string
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
          "A completed and enchanting adventure among the clouds. The minipool is deflated, tokens collected, and memories cherished. Farewell, until we see you again in the staking skies!"
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration)
        )

        .setColor(0x33b6ae)
        .setFooter({ text: "[finished] • minipool status change" }),
    ],
  };
};

export const MINIPOOL_CANCELED_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string
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
          "Alas, this minipool's journey has been called off. Heading back to terra firma, tokens in tow. A new adventure awaits, as a new flight awaits."
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration)
        )

        .setColor(0x33b6ae)
        .setFooter({ text: "[canceled] • minipool status change" }),
    ],
  };
};

export const MINIPOOL_ERROR_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string
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
          "Oh dear, it seems the minipool has encountered a hiccup! Fear not, for we shall set things right and resume our whimsical wanderings through the staking skies."
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration)
        )

        .setColor(0x33b6ae)
        .setFooter({ text: "[error] • minipool status change" }),
    ],
  };
};

export const MINIPOOL_RESTAKE_TEMPLATE = (
  transactionEvent: TransactionEvent,
  nodeId: string,
  owner: string,
  duration: string
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
          "The minipool has completed it's flight and is going out for another. Enjoy the ride!"
        )
        .addFields(
          pilotField(owner),
          balloonField(nodeId),
          tripDurationField(duration)
        )
        .setColor(0x33b6ae)
        .setFooter({ text: "[launched] • minipool status change" }),
    ],
  };
};

export const GGP_STAKING_STAKE_TEMPLATE = (
  transactionEvent: TransactionEvent,
  owner: string,
  amount: BigNumber,
  totalStake: BigNumber
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("⬆️  GGP Tokens Onboarded.")
        .setDescription("A Node Operator has staked GGP to their minipool(s)")
        .addFields(
          ggpAmountField(amount),
          ggpTotalStakeField(totalStake),
          pilotField(owner, { inline: false })
        )
        .setColor(0xa849c0)
        .setFooter({ text: "[stake] • staking" }),
    ],
  };
};

export const GGP_STAKING_WITHDRAW_TEMPLATE = (
  transactionEvent: TransactionEvent,
  owner: string,
  amount: BigNumber,
  totalStake: BigNumber
) => {
  return {
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        pilotComponent(owner),
        transactionComponent(transactionEvent.transactionHash)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle("⬇️  GGP Tokens Dropped Overboard.")
        .setDescription(
          "A Node Operator has un-staked GGP from their minipool(s)"
        )
        .addFields(
          ggpAmountField(amount, true),
          ggpTotalStakeField(totalStake),
          pilotField(owner, { inline: false })
        )
        .setColor(0xa849c0)
        .setFooter({ text: "[withdraw] • staking" }),
    ],
  };
};

export const GGAVAX_DEPOSIT_TEMPLATE = (
  transactionEvent: TransactionEvent,
  assets: BigNumber,
  shares: BigNumber,
  amountAvailableForStaking: BigNumber,
  stakingTotalAssets: BigNumber
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
        .setTitle("⬆️ GGAVAX Tokens Filled Up.")
        .setDescription(
          "GGAVAX tokens have been added to the liquid staking pool."
        )
        .addFields(
          liquidStakerField(transactionEvent.from, { inline: false }),
          ggAvaxAmount(assets, { name: "Amount added" }),
          ggAvaxAmount(amountAvailableForStaking, {
            name: "Amount Available for Staking",
          }),
          ggAvaxAmount(stakingTotalAssets, { name: "Total Assets" })
        )
        .setColor(0x447969)
        .setFooter({ text: "[deposit] • ggavax" }),
    ],
  };
};

export const GGAVAX_WITHDRAW_TEMPLATE = (
  transactionEvent: TransactionEvent,
  assets: BigNumber,
  shares: BigNumber,
  amountAvailableForStaking: BigNumber,
  stakingTotalAssets: BigNumber
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
        .setTitle("⬇️ GGAVAX Tokens Drained.")
        .setDescription(
          "GGAVAX tokens have been removed from the liquid staking pool."
        )
        .addFields(
          liquidStakerField(transactionEvent.from, { inline: false }),
          ggAvaxAmount(assets, { name: "Amount removed" }),
          ggAvaxAmount(amountAvailableForStaking, {
            name: "Amount Available for Staking",
          }),
          ggAvaxAmount(stakingTotalAssets, { name: "Total Assets" })
        )
        .setColor(0x447969)
        .setFooter({ text: "[withdraw] • ggavax" }),
    ],
  };
};
