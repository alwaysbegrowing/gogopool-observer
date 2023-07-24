export const abi = [
  {
    inputs: [
      {
        internalType: "contract Storage",
        name: "storageAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ContractNotFound", type: "error" },
  { inputs: [], name: "ContractPaused", type: "error" },
  { inputs: [], name: "InvalidAmount", type: "error" },
  { inputs: [], name: "InvalidOrOutdatedContract", type: "error" },
  { inputs: [], name: "MustBeGuardian", type: "error" },
  { inputs: [], name: "MustBeGuardianOrValidContract", type: "error" },
  { inputs: [], name: "MustBeMultisig", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "invoiceID",
        type: "string",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "GGPTokensSentByDAOProtocol",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "invoiceID", type: "string" },
      { internalType: "address", name: "recipientAddress", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "spend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
];