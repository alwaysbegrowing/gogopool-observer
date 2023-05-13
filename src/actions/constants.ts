import { utils } from "ethers";

import { abi as MinipoolManagerAbi } from "./abis/minipoolManager.json";

export const isDev = process.env.NODE_ENV === "development";

export const TENDERLY_PROJECT_SLUG = "arbor-finance";
export const TENDERLY_USERNAME = "namaskar_1f64f";

export const MINIPOOL_MANAGER_ABI = MinipoolManagerAbi;

export const MINIPOOL_MANAGER_INTERFACE = new utils.Interface(
  MinipoolManagerAbi
);
