export const SwapAggregatorAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "WETH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "accessRestriction",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IAccessRestriction"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addPath",
    "inputs": [
      {
        "name": "_router",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_name",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_path",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "quoteExactInput",
    "inputs": [
      {
        "name": "_path",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_amountIn",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "quoter",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IQuoter"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "removePath",
    "inputs": [
      {
        "name": "_router",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_name",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "routerPaths",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "swapAggregatorInitialize",
    "inputs": [
      {
        "name": "_accessRestriction",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_quoter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_WETH",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "swapExactETHForTokensV3",
    "inputs": [
      {
        "name": "_router",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_name",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_amountOutMin",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_to",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "swapExactTokensForEthV3",
    "inputs": [
      {
        "name": "_router",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_name",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_amountIn",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_amountOutMin",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_to",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "swapExactTokensForTokensV3",
    "inputs": [
      {
        "name": "_router",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_name",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_amountIn",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_amountOutMin",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_to",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [
      {
        "name": "newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "event",
    "name": "ExactETHForTokensSwapped",
    "inputs": [
      {
        "name": "router",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "amountIn",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amountOut",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "tokenOut",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ExactTokensForETHSwapped",
    "inputs": [
      {
        "name": "router",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "amountIn",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amountOut",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "tokenIn",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ExactTokensForTokensSwapped",
    "inputs": [
      {
        "name": "router",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "amountIn",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amountOut",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "tokenIn",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "tokenOut",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PathAdded",
    "inputs": [
      {
        "name": "router",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "path",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PathRemoved",
    "inputs": [
      {
        "name": "router",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "QuoteReceived",
    "inputs": [
      {
        "name": "amountIn",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amountOut",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "router",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "quoter",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Received",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967NonPayable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidAmount",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidInput",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidPath",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidPool",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoBalanceToWithdraw",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PathAlreadyExist",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PoolNotExist",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ReceivedLessToken",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TransferFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnsupportedProxiableUUID",
    "inputs": [
      {
        "name": "slot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsuccessfulTransfer",
    "inputs": []
  }
] as const