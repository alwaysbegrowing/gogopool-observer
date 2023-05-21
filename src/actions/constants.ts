import { utils } from "ethers";

import { abi as MinipoolManagerAbi } from "./abis/minipoolManager.json";
import { abi as WAVAXAbi } from "./abis/wavax.json";
import { abi as StakingAbi } from "./abis/staking.json";
import { abi as GGAVAXAbi } from "./abis/ggavax.json";

export const isDev = process.env.NODE_ENV === "development";

export const TENDERLY_PROJECT_SLUG = "arbor-finance";
export const TENDERLY_USERNAME = "namaskar_1f64f";
export const JSON_RPC_URL_SECRET_NAME = "JSON_RPC_URL";
export const DISCORD_WEBHOOK_URL_SECRET_NAME = "STRAWBERRY_WEBHOOK_URL";
export const DATABASE_WEBHOOK_URL_SECRET_NAME = "DATABASE_WEBHOOK_URL";
export const DATABASE_URI_SECRET_NAME = "DATABASE_URI";
export const DATABASE_NAME_SECRET_NAME = "DATABASE_NAME";
export const DATABASE_COLLECTION_SECRET_NAME = "DATABASE_COLLECTION";

export const MINIPOOL_MANAGER_ABI = MinipoolManagerAbi;
export const WAVAX_ABI = WAVAXAbi;
export const STAKING_ABI = StakingAbi;
export const GGAVAX_ABI = GGAVAXAbi;

export const MINIPOOL_MANAGER_ADDRESS =
  "0xC8De41C35FB389286546cF4107102a7656Da7037";
export const WAVAX_ADDRESS = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
export const STAKING_ADDRESS = "0x9946e68490D71Fe976951e360f295c4Cf8531D00";
export const GGAVAX_ADDRESS = "0xA25EaF2906FA1a3a13EdAc9B9657108Af7B703e3";

export const MINIPOOL_MANAGER_INTERFACE = new utils.Interface(
  MinipoolManagerAbi
);
export const WAVAX_INTERFACE = new utils.Interface(WAVAXAbi);
export const STAKING_INTERFACE = new utils.Interface(StakingAbi);
export const GGAVAX_INTERFACE = new utils.Interface(GGAVAXAbi);
