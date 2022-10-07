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

  // const contractName = "ZeedzINO"
  // const contractAddress = "0x7dc7430a06f38af3"
  const collectionPublicPath = "ZeedzINO.ZeedzCollectionPublic"


  const [user, setUser] = useState({addr: ''})
  const [result, setResult] = useState('');
  const [contractName, setContractName] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [addCollectionStatus, setAddCollectionStatus] = useState('');

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
    console.log('====== addCollections: ', contractName)
    console.log('====== address: ', contractAddress)
    console.log('====== tx: ', ADD_COLLECTION(contractName, contractAddress, collectionPublicPath))
    try {
      const res = await fcl.mutate({
        cadence: ADD_COLLECTION(contractName, contractAddress, collectionPublicPath)
      });
      console.log('====== add success')
      setAddCollectionStatus('Success')
    } catch (e) {
      setAddCollectionStatus('Failed')
    }
    
  };

  // test commit
  
  const getUserCollections = async (address) => {
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
        <p>
          Add Collection Tool 
        </p>
        <div>
          {user.addr ? "" : <button onClick={logIn}>Log In</button>}
          <p>
          Logged in user: {user.addr ? user.addr : ""}
          <button style={{marginLeft: '10px'}} onClick={logOut}>Log Out</button>
          </p>
          
        </div>
        <div style={{margin: '10px'}}>
          Add Collection:
          <div>
            Contract Name:
            <input
              style={{margin: '10px'}}
              type="text"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
            />
          
            Contract Address:
            <input
              style={{margin: '10px'}}
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          
            <button style={{margin: '10px'}} onClick={() => addCollections(user.addr)}>Add Collections</button>
          </div>
          <div>
            Add Collection Status: {addCollectionStatus}
          </div>
        </div>

        <div style={{marginTop: '20px'}}>
          <div style={{margin: '10px'}}>
            <button onClick={() => getUserCollections(user.addr)}>Get User Collections</button>
            <div style={{margin: '10px'}}>
              Collections: {result}
            </div>
          </div> 
        </div>     
    </div>
  );
}

export default App;
