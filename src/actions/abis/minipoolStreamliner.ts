export const abi = [
  {
    inputs: [
      {
        internalType: "contract Storage",
        name: "storageAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "WAVAX",
        type: "address",
      },
      {
        internalType: "address",
        name: "TJRouter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ContractNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "ContractPaused",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidOrOutdatedContract",
    type: "error",
  },
  {
    inputs: [],
    name: "MismatchedFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "MustBeGuardian",
    type: "error",
  },
  {
    inputs: [],
    name: "MustBeGuardianOrValidContract",
    type: "error",
  },
  {
    inputs: [],
    name: "MustBeMultisig",
    type: "error",
  },
  {
    inputs: [],
    name: "NotApprovedHardwareProvider",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "SwapFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "nodeID",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "hardwareProviderContract",
        type: "address",
      },
    ],
    name: "MinipoolRelaunched",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "nodeID",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "hardwareProviderContract",
        type: "address",
      },
    ],
    name: "NewStreamlinedMinipoolMade",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "nodeID",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "blsPubkeyAndSig",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "avaxForMinipool",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "avaxForGGP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minGGPAmountOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "avaxForNodeRental",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "hardwareProviderContract",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "hardwareProviderInformation",
            type: "bytes",
          },
        ],
        internalType: "struct MinipoolStreamliner.StreamlinedMinipool",
        name: "newMinipool",
        type: "tuple",
      },
    ],
    name: "createOrRelaunchStreamlinedMinipool",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "isApprovedHardwareProvider",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "receiveWithdrawalAVAX",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "avaxForGGP",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minGGPAmountOut",
        type: "uint256",
      },
    ],
    name: "swapAndStakeGGPOnBehalfOf",
    outputs: [
      {
        internalType: "uint256",
        name: "ggpPurchased",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
