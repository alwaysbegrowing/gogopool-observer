import { Context, Event, TransactionEvent } from "@tenderly/actions";
import { getGgpStakedEvent, getGgpWithdrawnEvent } from "./logParsing";
import {
  GGP_STAKING_STAKE_TEMPLATE,
  GGP_STAKING_WITHDRAW_TEMPLATE,
} from "./templates";
import { GGPStaked, GGPWithdrawn, StakerInformation } from "./types";
import { jsonRpcProvider } from "./ethers";
import { STAKING_ADDRESS, STAKING_INTERFACE } from "./constants";
import { initServices } from "./utils";
import { emitter } from "./emitter";

const handleGgpStakedEvent = async (
  transactionEvent: TransactionEvent,
  ggpStakedEvent: GGPStaked
) => {
  const { from, amount } = ggpStakedEvent;
  const { ggpStaked, isNodeOperator } = await getStakerInformation(from);

  await emitter.emit(
    GGP_STAKING_STAKE_TEMPLATE(
      transactionEvent,
      from,
      amount,
      ggpStaked,
      isNodeOperator
    )
  );
};

const handleGgpWithdrawnEvent = async (
  transactionEvent: TransactionEvent,
  ggpWithdrawnEvent: GGPWithdrawn
) => {
  const { to, amount } = ggpWithdrawnEvent;
  const { ggpStaked, isNodeOperator } = await getStakerInformation(to);

  await emitter.emit(
    GGP_STAKING_WITHDRAW_TEMPLATE(
      transactionEvent,
      to,
      amount,
      ggpStaked,
      isNodeOperator
    )
  );
};

const getStakerInformation = async (
  stakerAddr: string
): Promise<StakerInformation & { isNodeOperator: boolean }> => {
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
  const { avaxStaked, avaxValidatingHighWater } = stakerDecodeResult[0];
  const isNodeOperator = avaxStaked.gt(0) || avaxValidatingHighWater.gt(0);
  return { ...stakerDecodeResult[0], isNodeOperator };
};

export const stakeOrWithdraw = async (context: Context, event: Event) => {
  await initServices(context);
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
