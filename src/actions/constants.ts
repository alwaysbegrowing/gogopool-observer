import { utils } from "ethers";

import { abi as MinipoolManagerAbi } from "./abis/minipoolManager.json";
import { abi as WAVAXAbi } from "./abis/wavax.json";

export const isDev = process.env.NODE_ENV === "development";

export const TENDERLY_PROJECT_SLUG = "arbor-finance";
export const TENDERLY_USERNAME = "namaskar_1f64f";

export const MINIPOOL_MANAGER_ABI = MinipoolManagerAbi;
export const WAVAX_ABI = WAVAXAbi;

export const MINIPOOL_MANAGER_ADDRESS =
  "0xC8De41C35FB389286546cF4107102a7656Da7037";
export const MINIPOOL_MANAGER_INTERFACE = new utils.Interface(
  MinipoolManagerAbi
);
export const WAVAX_INTERFACE = new utils.Interface(WAVAXAbi);
