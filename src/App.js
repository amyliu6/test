import logo from './logo.svg';
import './App.css';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { useEffect, useState } from "react"
import { GET_NFT_COLLECTION, ADD_COLLECTION } from "../src/flow"
import networks from "./networks.js"

const { accessApi, walletDiscovery } = networks["testnet"];

fcl.config({
  "accessNode.api": accessApi,
  "discovery.wallet": walletDiscovery, // dev wallet
})

function App() {

  const [user, setUser] = useState({addr: ''})
  const [result, setResult] = useState('');

  useEffect(() => {
    fcl.currentUser.subscribe(setUser)
  }, [])

  const logIn = () => {
    fcl.authenticate()
  }
  
  const logOut = () => {
    fcl.unauthenticate()
  }

  const addCollections = async (address) => {
    console.log('====== addCollections: ')
    //A.9f2eb43b6df02730.Momentables.NFT
    const contractName = "Momentables"
    const contractAddress = "0x9f2eb43b6df02730"

    console.log('====== tx: ', ADD_COLLECTION(contractName, contractAddress))
    const res = await fcl.mutate({
      cadence: ADD_COLLECTION(contractName, contractAddress)
    });

    console.log('====== add success')
  };

  const getUserCollections = async (address) => {
    const contractName = "Momentables"
    const contractAddress = "0x9f2eb43b6df02730"
    const collectionPath = { domain: "public", identifier: "MomentablesCollection"}
    console.log('====== get tx: ', GET_NFT_COLLECTION(contractName, contractAddress))
    const res = await fcl.query({
      cadence: GET_NFT_COLLECTION(contractName, contractAddress),
      args: (arg, t) => [
        arg(address, t.Address)
      ],
    });
  
    console.log('========= res ', res)
    setResult(res)

  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Hello world 4.
        </p>
        <div>
          {user.addr ? user.addr : ""}
          <button onClick={logIn}>Log In</button>
          <button onClick={logOut}>Log Out</button>
        </div>
        <div>
          <button onClick={() => addCollections(user.addr)}>Add Collections</button>

          <button onClick={() => getUserCollections(user.addr)}>Get User Collections</button>
        </div>
        <div>
           Result: {result}
        </div>
      </header>
      
    </div>
  );
}

export default App;
