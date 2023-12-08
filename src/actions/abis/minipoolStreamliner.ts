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
        name: "USDC",
        type: "address",
      },
      {
        internalType: "address",
        name: "TJRouter",
        type: "address",
      },
      {
        internalType: "address",
        name: "Oonodz",
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
    name: "IncorrectNodeIDFormat",
    type: "error",
  },
  {
    inputs: [],
    name: "IncorrectNodeIDLength",
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
        internalType: "bool",
        name: "isUsingOonodz",
        type: "bool",
      },
    ],
    name: "NewStreamlinedMinipoolMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "reciever",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "USDCRefunded",
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
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "uint16",
            name: "countryOfResidence",
            type: "uint16",
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
            internalType: "uint256",
            name: "minUSDCAmountOut",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "bestRate",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "withdrawalRightWaiver",
            type: "bool",
          },
        ],
        internalType: "struct MinipoolStreamliner.StreamlinedMinipool",
        name: "newMinipool",
        type: "tuple",
      },
    ],
    name: "createStreamlinedMinipool",
    outputs: [],
    stateMutability: "payable",
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
