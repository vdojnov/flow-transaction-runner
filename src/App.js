import React, { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import CodeEditor from '@uiw/react-textarea-code-editor';
import './App.css';

const CONTRACT_ADDRESSES = {
  "mainnet": {
      "0xDomains": "0x233eb012d34b0070",
      "0xFind": "0x097bafa4e0b48eef",
      "0xFlowFees": "0xf919ee77447b7497",
      "0xFlowIDTableStaking": "0x8624b52f9ddcd04a",
      "0xFlowns": "0x233eb012d34b0070",
      "0xFlowTableStaking": "0x8624b52f9ddcd04a",
      "0xFlowEpoch": "0x8624b52f9ddcd04a",
      "0xFlowToken": "0x1654653399040a61",
      "0xFungibleToken": "0xf233dcee88fe0abe",
      "0xFungibleTokenMetadataViews": "0xf233dcee88fe0abe",
      "0xHybridCustody": "0xd8a7e05a7ac670c0",
      "0xLockedTokens": "0x8d0e87b65159ae63",
      "0xMetadataViews": "0x1d7e57aa55817448",
      "0xNonFungibleToken": "0x1d7e57aa55817448",
      "0xViewResolver":"0x1d7e57aa55817448",
      "0xStakingCollection": "0x8d0e87b65159ae63",
      "0xFlowStakingCollection": "0x8d0e87b65159ae63",
      "0xStakingProxy": "0x62430cf28c26d095",
      "0xSwapError": "0xb78ef7afa52ff906",
      "0xSwapRouter": "0xa6850776a94e6551",
      "0xEVM": "0xe467b9dd11fa00df",
      "0xFlowEVMBridge": "0x1e4aa0b87d10b141",
      "0xCapabilityFilter": "0xd8a7e05a7ac670c0",
      "0xFlowEVMBridgeConfig": "0x1e4aa0b87d10b141",
      "0xScopedFTProviders": "0x1e4aa0b87d10b141",
      "0xFlowEVMBridgeUtils": "0x1e4aa0b87d10b141",
      "0xEVMUtils": "0x1e4aa0b87d10b141",
      "0xStorageRent": "0x707adbad1428c624",
      "0xFLOAT": "0x2d4c3caffbeab845",
      "0xUSDCFlow": "0xf1ab99c82dee3526",
      "0xLostAndFound": "0x473d6a2c37eab5be",
      "0xCapabilityFactory": "0xd8a7e05a7ac670c0",
      "0xCapabilityDelegator": "0xd8a7e05a7ac670c0",
      "0xstFlowToken": "0xd6f80565193ad727",
      "0xFiatToken": "0xb19436aae4d94622",
      "0xCrossVMMetadataViews": "0xTODO"
  },
  "testnet": {
      "0xDomains": "0xb05b2abb42335e88",
      "0xFind": "0xa16ab1d0abde3625",
      "0xFlowFees": "0x912d5440f7e3769e",
      "0xFlowIDTableStaking": "0x9eca2b38b18b5dfe",
      "0xFlowEpoch": "0x9eca2b38b18b5dfe",
      "0xFlowns": "0xb05b2abb42335e88",
      "0xFlowTableStaking": "0x9eca2b38b18b5dfe",
      "0xFlowToken": "0x7e60df042a9c0868",
      "0xFungibleToken": "0x9a0766d93b6608b7",
      "0xFungibleTokenMetadataViews": "0x9a0766d93b6608b7",
      "0xHybridCustody": "0x294e44e1ec6993c6",
      "0xLockedTokens": "0x95e019a17d0e23d7",
      "0xMetadataViews": "0x631e88ae7f1d7c20",
      "0xNonFungibleToken": "0x631e88ae7f1d7c20",
      "0xViewResolver": "0x631e88ae7f1d7c20",
      "0xStakingCollection": "0x95e019a17d0e23d7",
      "0xFlowStakingCollection": "0x95e019a17d0e23d7",
      "0xStakingProxy": "0x7aad92e5a0715d21",
      "0xSwapError": "0xddb929038d45d4b3",
      "0xSwapRouter": "0x2f8af5ed05bbde0d",
      "0xEVM": "0x8c5303eaa26202d6",
      "0xFlowEVMBridge": "0xdfc20aee650fcbdf",
      "0xCapabilityFilter": "0x294e44e1ec6993c6",
      "0xFlowEVMBridgeConfig": "0xdfc20aee650fcbdf",
      "0xScopedFTProviders": "0xdfc20aee650fcbdf",
      "0xFlowEVMBridgeUtils": "0xdfc20aee650fcbdf",
      "0xEVMUtils": "0xdfc20aee650fcbdf",
      "0xStorageRent": "0xd50084a1a43b1507",
      "0xFLOAT": "0x0afe396ebc8eee65",
      "0xUSDCFlow": "0x64adf39cbc354fcb",
      "0xLostAndFound": "0xbe4635353f55bbd4",
      "0xCapabilityFactory": "0x294e44e1ec6993c6",
      "0xCapabilityDelegator": "0x294e44e1ec6993c6",
      "0xstFlowToken": "0xe45c64ecfe31e465",
      "0xFiatToken": "0xa983fecbed621163",
      "0xCrossVMMetadataViews": "0x631e88ae7f1d7c20"
      
  }
};

// Configure FCL
fcl.config({
  "app.detail.title": "Flow Transaction Runner",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
  "flow.network": "mainnet"
})
.put("0xFungibleToken", "0xf233dcee88fe0abe");

function App() {
  const [user, setUser] = useState({ loggedIn: false });
  const [transaction, setTransaction] = useState('');
  const [args, setArgs] = useState('');
  const [result, setResult] = useState(null);
  const [network, setNetwork] = useState('mainnet');
  const [gasLimit, setGasLimit] = useState(9999);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  const handleNetworkChange = (selectedNetwork) => {
    setNetwork(selectedNetwork);
    fcl.config({
      "app.detail.title": "Flow Transaction Runner",
      "app.detail.icon": "https://placekitten.com/g/200/200",
      "accessNode.api": selectedNetwork === 'mainnet' 
        ? "https://rest-mainnet.onflow.org"
        : "https://rest-testnet.onflow.org",
      "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
      "flow.network": selectedNetwork
    });
    setResult(null);
  };

  const handleConnect = () => {
    fcl.authenticate();
  };

  const handleDisconnect = () => {
    fcl.unauthenticate();
  };

  const replaceAddresses = (code, network) => {
    if (!code) return code;
    
    let replacedCode = code;
    const addresses = CONTRACT_ADDRESSES[network];
    
    Object.keys(addresses).forEach(contract => {
      const regex = new RegExp(contract, 'g');
      replacedCode = replacedCode.replace(regex, addresses[contract]);
    });
    
    return replacedCode;
  };

  const executeTransaction = async () => {
    try {
      let parsedArgs = [];
      if (args.trim()) {
        parsedArgs = JSON.parse(args);
      }

      // Get network using async config().get()
      const network = await fcl.config().get("flow.network");
      console.log("Current network:", network);
      console.log("Parsed arguments:", parsedArgs);
      
      if (!network) {
        throw new Error("Network not properly configured");
      }

      if (!CONTRACT_ADDRESSES[network]) {
        throw new Error(`Unknown network: ${network}`);
      }

      const processedTransaction = replaceAddresses(transaction, network);
      console.log("Original transaction:", transaction);
      console.log("Processed transaction:", processedTransaction);

      if (!processedTransaction || processedTransaction.trim() === '') {
        throw new Error("Transaction code is empty");
      }

      // Helper function to convert Flow-formatted argument to FCL argument
      const convertFlowArg = (item, arg, t) => {
        if (item.type && item.value !== undefined) {
          switch (item.type) {
            case 'UInt256':
              return arg(item.value, t.UInt256);
            case 'String':
              return arg(item.value, t.String);
            case 'Int':
              return arg(item.value, t.Int);
            case 'UInt64':
              return arg(item.value, t.UInt64);
            case 'UFix64':
              return arg(item.value, t.UFix64);
            case 'Bool':
              return arg(item.value, t.Bool);
            case 'Address':
              // Ensure address has 0x prefix
              const address = item.value.startsWith('0x') ? item.value : `0x${item.value}`;
              return arg(address, t.Address);
            case 'Array':
              const arrayType = item.value[0]?.type;
              return arg(
                item.value.map(v => v.value),
                t.Array(t[arrayType])
              );
            default:
              throw new Error(`Unsupported Flow type: ${item.type}`);
          }
        }
        
        // Handle simple JavaScript values (backwards compatibility)
        if (typeof item === 'string') {
          return arg(item, t.String);
        } else if (typeof item === 'number') {
          if (Number.isInteger(item)) {
            return arg(item, t.Int);
          } else {
            return arg(item, t.UFix64);
          }
        } else if (typeof item === 'boolean') {
          return arg(item, t.Bool);
        }
        
        throw new Error(`Unsupported argument type: ${typeof item}`);
      };

      const transactionId = await fcl.mutate({
        cadence: processedTransaction,
        args: (arg, t) => {
          const convertedArgs = parsedArgs.map(item => {
            console.log("Converting argument:", item);
            const result = convertFlowArg(item, arg, t);
            console.log("Converted result:", result);
            return result;
          });
          console.log("Final converted arguments:", convertedArgs);
          return convertedArgs;
        },
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: gasLimit
      });

      const response = await fcl.tx(transactionId).onceSealed();
      setResult(response);
    } catch (error) {
      console.error("Transaction error:", error);
      console.error("Error stack:", error.stack);
      setResult({ error: error.toString() });
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Flow Transaction Runner</h1>
        <div className="network-controls">
          <select 
            value={network} 
            onChange={(e) => handleNetworkChange(e.target.value)}
            style={{
              padding: '8px',
              marginRight: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="mainnet">Mainnet</option>
            <option value="testnet">Testnet</option>
          </select>
          {user.loggedIn ? (
            <div>
              <p>Connected: {user?.addr}</p>
              <button onClick={handleDisconnect}>Disconnect</button>
            </div>
          ) : (
            <button onClick={handleConnect}>Connect Wallet</button>
          )}
        </div>
      </header>

      <main>
        <div className="editor-section">
          <h2>Transaction Code</h2>
          <CodeEditor
            value={transaction}
            language="cadence"
            placeholder="Enter your Cadence transaction here..."
            onChange={(e) => setTransaction(e.target.value)}
            padding={15}
            style={{
              fontSize: 12,
              backgroundColor: "#f5f5f5",
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              minHeight: '200px',
              marginBottom: '20px'
            }}
          />
        </div>

        <div className="args-section">
          <h2>Arguments (JSON format)</h2>
          <CodeEditor
            value={args}
            language="json"
            placeholder='Enter arguments as JSON array. Example: [
    {
      "type": "Address",
      "value": "0x324c6acd6cd3dc88"
    },
    {
      "type": "String",
      "value": "ExampleNFTv2"
    },
    {
      "type": "Array",
      "value": [
        {
          "type": "UInt64",
          "value": "4224"
        }
      ]
    }
]'
            onChange={(e) => setArgs(e.target.value)}
            padding={15}
            style={{
              fontSize: 12,
              backgroundColor: "#f5f5f5",
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              minHeight: '100px',
              marginBottom: '20px'
            }}
          />
        </div>

        <div className="gas-limit-section">
          <h2>Gas Limit</h2>
          <input
            type="number"
            value={gasLimit}
            onChange={(e) => setGasLimit(parseInt(e.target.value))}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginBottom: '20px',
              width: '200px'
            }}
          />
        </div>

        <button 
          onClick={executeTransaction}
          disabled={!user.loggedIn || !transaction.trim()}
        >
          Execute Transaction
        </button>

        {result && (
          <div className="result-section">
            <h2>Result</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 