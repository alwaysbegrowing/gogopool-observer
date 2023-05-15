import { Context, Event, TransactionEvent } from "@tenderly/actions";
import { discordClient } from "./discord";
import { getGgpStakedEvent, getGgpWithdrawnEvent } from "./logParsing";
import {
  GGP_STAKING_STAKE_TEMPLATE,
  GGP_STAKING_WITHDRAW_TEMPLATE,
} from "./templates";
import { GGPStaked, GGPWithdrawn, StakerInformation } from "./types";
import { jsonRpcProvider } from "./ethers";
import { STAKING_ADDRESS, STAKING_INTERFACE } from "./constants";

const handleGgpStakedEvent = async (
  transactionEvent: TransactionEvent,
  ggpStakedEvent: GGPStaked
) => {
  const { from, amount } = ggpStakedEvent;
  const { ggpStaked } = await getStakerInformation(from);
  await discordClient.sendMessage(
    GGP_STAKING_STAKE_TEMPLATE(transactionEvent, from, amount, ggpStaked)
  );
};

const handleGgpWithdrawnEvent = async (
  transactionEvent: TransactionEvent,
  ggpWithdrawnEvent: GGPWithdrawn
) => {
  const { to, amount } = ggpWithdrawnEvent;
  const { ggpStaked } = await getStakerInformation(to);
  await discordClient.sendMessage(
    GGP_STAKING_WITHDRAW_TEMPLATE(transactionEvent, to, amount, ggpStaked)
  );
};

const getStakerInformation = async (
  stakerAddr: string
): Promise<StakerInformation> => {
  const callResult = await jsonRpcProvider.getProvider().call({
    to: STAKING_ADDRESS,
    data: STAKING_INTERFACE.encodeFunctionData("requireValidStaker", [
      stakerAddr,
    ]),
  });
  const decodeResult = STAKING_INTERFACE.decodeFunctionResult(
    "requireValidStaker",
    callResult
  );
  const stakerIndex = decodeResult[0];
  const staker = await jsonRpcProvider.getProvider().call({
    to: STAKING_ADDRESS,
    data: STAKING_INTERFACE.encodeFunctionData("getStaker", [stakerIndex]),
  });
  const stakerDecodeResult = STAKING_INTERFACE.decodeFunctionResult(
    "getStaker",
    staker
  );
  return stakerDecodeResult[0];
};

export const stakeOrWithdraw = async (context: Context, event: Event) => {
  discordClient.init(await context.secrets.get("MANGO_WEBHOOK_URL"));
  jsonRpcProvider.init(await context.secrets.get("JSON_RPC_URL"));
  const transactionEvent = event as TransactionEvent;

  const ggpStakedEvent = await getGgpStakedEvent(transactionEvent);
  if (ggpStakedEvent) {
    await handleGgpStakedEvent(transactionEvent, ggpStakedEvent);
  } else {
    const ggpWithdrawnEvent = await getGgpWithdrawnEvent(transactionEvent);
    if (!ggpWithdrawnEvent) {
      throw new Error("No GGPStaked or GGPWithdrawn event found");
    }
    await handleGgpWithdrawnEvent(transactionEvent, ggpWithdrawnEvent);
  }
};
