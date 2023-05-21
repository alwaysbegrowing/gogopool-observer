import { Context, Event, TransactionEvent } from "@tenderly/actions";
import { getGgAvaxDepositEvent, getGgAvaxWithdrawEvent } from "./logParsing";
import { GGAVAX_DEPOSIT_TEMPLATE, GGAVAX_WITHDRAW_TEMPLATE } from "./templates";
import { GGAVAXDeposit, GGAVAXWithdraw, GgAvaxInformation } from "./types";
import { jsonRpcProvider } from "./ethers";
import { GGAVAX_ADDRESS, GGAVAX_INTERFACE } from "./constants";
import { initServices } from "./utils";
import { emitter } from "./emitter";

const handleGgAvaxDepositEvent = async (
  transactionEvent: TransactionEvent,
  ggpStakedEvent: GGAVAXDeposit
) => {
  const { assets, shares } = ggpStakedEvent;
  const { amountAvailableForStaking } = await getGgAvaxInformation();
  await emitter.emit(
    GGAVAX_DEPOSIT_TEMPLATE(
      transactionEvent,
      assets,
      shares,
      amountAvailableForStaking
    )
  );
};

const handleGgAvaxEvent = async (
  transactionEvent: TransactionEvent,
  ggpWithdrawnEvent: GGAVAXWithdraw
) => {
  const { assets, shares } = ggpWithdrawnEvent;
  const { amountAvailableForStaking } = await getGgAvaxInformation();
  await emitter.emit(
    GGAVAX_WITHDRAW_TEMPLATE(
      transactionEvent,
      assets,
      shares,
      amountAvailableForStaking
    )
  );
};

const getGgAvaxInformation = async (): Promise<GgAvaxInformation> => {
  const amountAvailableForStakingCallResult = jsonRpcProvider
    .getProvider()
    .call({
      to: GGAVAX_ADDRESS,
      data: GGAVAX_INTERFACE.encodeFunctionData("amountAvailableForStaking"),
    });
  const stakingTotalAssetsCallResult = jsonRpcProvider.getProvider().call({
    to: GGAVAX_ADDRESS,
    data: GGAVAX_INTERFACE.encodeFunctionData("stakingTotalAssets"),
  });
  const [amountAvailableForStakingResult, stakingTotalAssetsResult] =
    await Promise.all([
      amountAvailableForStakingCallResult,
      stakingTotalAssetsCallResult,
    ]);

  const amountAvailableForStaking = GGAVAX_INTERFACE.decodeFunctionResult(
    "amountAvailableForStaking",
    amountAvailableForStakingResult
  )[0];
  const stakingTotalAssets = GGAVAX_INTERFACE.decodeFunctionResult(
    "stakingTotalAssets",
    stakingTotalAssetsResult
  )[0];
  return { amountAvailableForStaking, stakingTotalAssets };
};

export const stakeOrWithdraw = async (context: Context, event: Event) => {
  await initServices(context);
  const transactionEvent = event as TransactionEvent;

  const ggAvaxEvent = await getGgAvaxDepositEvent(transactionEvent);
  if (ggAvaxEvent) {
    await handleGgAvaxDepositEvent(transactionEvent, ggAvaxEvent);
  } else {
    const ggAvaxWithdrawEvent = await getGgAvaxWithdrawEvent(transactionEvent);
    if (!ggAvaxWithdrawEvent) {
      throw new Error("No Withdraw or Deposit event found");
    }
    await handleGgAvaxEvent(transactionEvent, ggAvaxWithdrawEvent);
  }
};
