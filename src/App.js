import React from 'react';
import logo from './logo.svg';
import './App.css';
import RLogin, { RLoginButton } from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useState } from 'react';
import Web3 from 'web3';
import MocAbi from './Contract.json';
import MocConnectorAbi from './MocConnector.json';
 // construct rLogin pop-up in DOM
const rLogin = new RLogin({
  cachedProvider: false, // change to true to cache user's wallet choice
  providerOptions: { // read more about providers setup in https://github.com/web3Modal/web3modal/
    walletconnect: {
      package: WalletConnectProvider, // setup wallet connect for mobile wallet support
      options: {
        rpc: {
          31: 'https://public-node.testnet.rsk.co' // use RSK public nodes to connect to the testnet
        }
      }
    }
  },
  supportedChains: [31] // enable rsk testnet network
})

function App() {
  
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [isLogin, setisLogin] = useState(false)

    // display pop up
  const connect = () => rLogin.connect()
    .then(({ provider }) => { // the provider is used to operate with user's wallet
      setProvider(provider)
      // request user's account
      provider.request({ method: 'eth_accounts' }).then(([account]) => 
      {setAccount(account); 
       setisLogin(true);
      })
    })
    const callback = (error, transactionHash) => {
      console.log(transactionHash);
      console.log('Mint done ' + transactionHash);
    }

    const HardcodedMint = async (e) => {
      e.preventDefault();
      const web3 = new Web3(provider);
      const getContract = (abi, contractAddress) => new web3.eth.Contract(abi, contractAddress);
      const moc = getContract(MocAbi.abi, '0x01AD6f8E884ed4DDC089fA3efC075E9ba45C9039');
      const connectorAddress = await moc.methods.connector().call();
      const mocConnector = getContract(MocConnectorAbi.abi, connectorAddress);

      return moc.methods.mintBProVendors(1000000000000000, '0xdda74880d638451e6d2c8d3fc19987526a7af730').send(
        {
          from: '0x371E637DE56De8971E6C75a17977D48862eae53E',
          value: 1001500000000000,
          gasPrice: 72983680,
          gas: 1036684,
          gasLimit: 1036684
        },
        callback
      );
    }
   
  return (
    <div>
      <div className="App">
        <RLoginButton onClick={connect}>{isLogin ? "Connected wallet" : "Connect wallet"}</RLoginButton>
        <p>wallet address: {account}</p>
      </div>
      {isLogin &&
      <form onSubmit={HardcodedMint}>
      <button>Hardcoded Mint</button>
      </form>}
    </div>
  );
}

export default App;
