import { utils } from "ethers";
import { abi as ClaimNodeOpAbi } from "./abis/claimNodeOp";
import { abi as ClaimProtocolDaoAbi } from "./abis/claimProtocolDao";
import { abi as MinipoolManagerAbi } from "./abis/minipoolManager";
import { abi as MultisigManagerAbi } from "./abis/multisigManager";
import { abi as OcyticusAbi } from "./abis/ocyticus";
import { abi as OracleAbi } from "./abis/oracle";
import { abi as ProtocolDaoAbi } from "./abis/protocolDao";
import { abi as RewardsPoolAbi } from "./abis/rewardsPool";
import { abi as StakingAbi } from "./abis/staking";
import { abi as StorageAbi } from "./abis/storage";
import { abi as TokenggAvaxAbi } from "./abis/tokenggAvax";
import { abi as TokenggpAbi } from "./abis/tokenggp";
import { abi as VaultAbi } from "./abis/vault";
import { abi as WAVAXAbi } from "./abis/wavax";
import { abi as MinipoolStreamlinerAbi } from "./abis/minipoolStreamliner";
import { abi as GGPVaultAbi } from "./abis/ggpvault";

export const isDev = process.env.NODE_ENV === "development";

export const TENDERLY_PROJECT_SLUG = "arbor-finance";
export const TENDERLY_USERNAME = "namaskar_1f64f";
export const JSON_RPC_URL_SECRET_NAME = "JSON_RPC_URL";
export const DISCORD_WEBHOOK_URL_SECRET_NAME = "STRAWBERRY_WEBHOOK_URL";
export const DATABASE_WEBHOOK_URL_SECRET_NAME = "DATABASE_WEBHOOK_URL";
export const DATABASE_URI_SECRET_NAME = "DATABASE_URI";
export const DATABASE_NAME_SECRET_NAME = "DATABASE_NAME";
export const DATABASE_COLLECTION_SECRET_NAME = "DATABASE_COLLECTION";

export const CLAIM_NODE_OP_ABI = ClaimNodeOpAbi;
export const CLAIM_PROTOCOL_DAO_ABI = ClaimProtocolDaoAbi;
export const MINIPOOL_MANAGER_ABI = MinipoolManagerAbi;
export const MULTISIG_MANAGER_ABI = MultisigManagerAbi;
export const OCYTICUS_ABI = OcyticusAbi;
export const ORACLE_ABI = OracleAbi;
export const PROTOCOL_DAO_ABI = ProtocolDaoAbi;
export const REWARDS_POOL_ABI = RewardsPoolAbi;
export const STAKING_ABI = StakingAbi;
export const STORAGE_ABI = StorageAbi;
export const TOKENGG_AVAX_ABI = TokenggAvaxAbi;
export const TOKENGGP_ABI = TokenggpAbi;
export const VAULT_ABI = VaultAbi;
export const WAVAX_ABI = WAVAXAbi;
export const MINIPOOL_STREAMLINER_ABI = MinipoolStreamlinerAbi;
export const GGP_VAULT_ABI = GGPVaultAbi;

export const CLAIM_NODE_OP_ADDRESS =
  "0xb42CfaD450B46FDc9cAC5FBF14Bc2e6091AfC35c";
export const CLAIM_PROTOCOL_DAO_ADDRESS =
  "0x4169CF88c7Ed811E6f6e61917c5b915BeA49476c";
export const MINIPOOL_MANAGER_ADDRESS = "0x17395Ad76b236FABeaC3634b78fF8F6970222199";
export const MULTISIG_MANAGER_ADDRESS =
  "0x7fff419c562Dd8b3cf16C335a01CDb37ea1B6a3B";
export const OCYTICUS_ADDRESS = "0x9189d18F453b1Ec1F02E40A8e3711334f9eA210B";
export const ORACLE_ADDRESS = "0x30fb915258D844E9dC420B2C3AA97420AEA16Db7";
export const PROTOCOL_DAO_ADDRESS =
  "0xA008Cc1839024A311ad769e4aC302EE35A8EF546";
export const REWARDS_POOL_ADDRESS =
  "0xAA8FD06cc3f1059b6d35870Bbf625C1Bac7c1B1D";
export const STAKING_ADDRESS = "0xB6dDbf75e2F0C7FC363B47B84b5C03959526AecB";
export const STORAGE_ADDRESS = "0x1cEa17F9dE4De28FeB6A102988E12D4B90DfF1a9";
export const VAULT_ADDRESS = "0xd45Cb6F5AcA41AfAAAeBdBE4EFBA49c1bC41E6BA";
export const TOKENGGP_ADDRESS = "0x69260B9483F9871ca57f81A90D91E2F96c2Cd11d";
export const TOKENGG_AVAX_ADDRESS =
  "0xA25EaF2906FA1a3a13EdAc9B9657108Af7B703e3";
export const WAVAX_ADDRESS = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
export const MINIPOOL_STREAMLINER = "0x8C05D78066431C3b11bBFB6f3546fD3F1396115C";

export const CLAIM_NODE_OP_INTERFACE = new utils.Interface(ClaimNodeOpAbi);
export const CLAIM_PROTOCOL_DAO_INTERFACE = new utils.Interface(
  ClaimProtocolDaoAbi
);
export const MINIPOOL_MANAGER_INTERFACE = new utils.Interface(
  MinipoolManagerAbi
);
export const MULTISIG_MANAGER_INTERFACE = new utils.Interface(
  MultisigManagerAbi
);
export const OCYTICUS_INTERFACE = new utils.Interface(OcyticusAbi);
export const ORACLE_INTERFACE = new utils.Interface(OracleAbi);
export const PROTOCOL_DAO_INTERFACE = new utils.Interface(ProtocolDaoAbi);
export const REWARDS_POOL_INTERFACE = new utils.Interface(RewardsPoolAbi);
export const STAKING_INTERFACE = new utils.Interface(StakingAbi);
export const STORAGE_INTERFACE = new utils.Interface(StorageAbi);
export const TOKEN_GGAVAX_INTERFACE = new utils.Interface(TokenggAvaxAbi);
export const TOKEN_GGP_INTERFACE = new utils.Interface(TokenggpAbi);
export const VAULT_INTERFACE = new utils.Interface(VaultAbi);
export const WAVAX_INTERFACE = new utils.Interface(WAVAXAbi);
export const MINIPOOL_STREAMLINER_INTERFACE = new utils.Interface(
  MinipoolStreamlinerAbi
);
export const GGP_VAULT_INTERFACE = new utils.Interface(GGPVaultAbi);
