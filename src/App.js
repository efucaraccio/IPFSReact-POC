import React from 'react';
import logo from './logo.svg';
import './App.css';
import RLogin, { RLoginButton } from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useState } from 'react';

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

    // display pop up
  const connect = () => rLogin.connect()
    .then(({ provider }) => { // the provider is used to operate with user's wallet
      setProvider(provider)
      // request user's account
      provider.request({ method: 'eth_accounts' }).then(([account]) => setAccount(account))
    })

  return (
    <div className="App">
      <RLoginButton onClick={connect}>Connect wallet</RLoginButton>
      <p>wallet address: {account}</p>
    </div>
  );
}

export default App;
