import React, { useState,useEffect } from 'react'
// import LocationDetails from '../components/LocationDetails'
// import LocationMap from '../components/LocationMap'
// import StreetView from '../components/StreetView'
import '../bootstrap-4.0.0-beta.2-dist/css/bootstrap.min.css'
import '../App.css'
// import Map from "../components/Map";
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { wmap } from '../config'
import WMAP from '../WMAPAbi.json'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import QRCode from "qrcode.react";

const client = ipfsHttpClient('https://wmap.infura.io:5001/api/v0')
function MyDetails  ()  {
  const [qrValue, setQrValue] = useState("jeftar");
 
    const [walletAddress, setWalletAddress] = useState("");
    const navigate = useNavigate()
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    

    useEffect(() => {
        loadNFTs()
    }, [])

    async function requestAccount() {
        // console.log('Requesting account...');
    
        // ❌ Check if Meta Mask Extension exists 
        if(window.ethereum) {
          // console.log('detected');
    
          try {
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            setWalletAddress(accounts[0]);
          } catch (error) {
            console.log('Error connecting...');
          }
    
        } else {
          alert('Meta Mask not detected');
        }
      }

      async function loadNFTs() {
        const web3Modal = new Web3Modal({
          network: "mainnet",
          cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        if(typeof window.ethereum !== 'undefined') {
          // await addNetwork();
          await requestAccount();
    
          const provider = new ethers.providers.Web3Provider(window.ethereum);
        }
    
        const marketplaceContract = new ethers.Contract(wmap, WMAP.abi, signer)
        const data = await marketplaceContract.fetchHouse()
        
        const items = await Promise.all(data.map(async i => {
        // const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
        // const meta = await axios.get(tokenURI)
        //   let OwnerName = ethers.utils.formatUnits(i.OwnerName.toString(), 'ether')
        // let auctionprice = ethers.utils.formatUnits(i.auctionprice.toString(), 'ether')
          
          let item = {
            
            // OwnerName,
            tokenId: i.tokenId.toNumber(),
            // seller: i.seller,
            
            owner: i.OwnerAddress,
            
            OwnerName: i.OwnerName,
          
            houseAddress:i.houseAddress,
            // tokenURI
          }
          return item
          

        }))
        setNfts(items)
        console.log(items)
        setLoadingState('loaded') 
        // return(account)

      }
 
      
  
        



    return (
    <>
{nfts.map((nft, i) => (

      <div className="space-y-20" key={i}>
        <div className="space-y-10">
          <span htmlFor="name" className="nameInput">QR Code</span>
          <QRCode
        id="qr-gen"
        value={nft.OwnerName +','+ nft.OwnerAddress+','+ nft.houseAddress.split(',')[0] +','+ nft.houseAddress.split(',')[1]}
        size={290}
        level={"H"}
        includeMargin={true}
      />
        </div>

        <div className="space-y-10">
          <span htmlFor="name" className="nameInput">Owner Name</span>
          {/* <input id="name" type="text" className="form-control"
            placeholder="House's Owner Name"
            onChange={e => updateFormInput({ ...formInput, OwnerName: e.target.value })}
             /> */}
        </div>

        <div className="space-y-10">
          <span className="nameInput">Verification Details </span>

          {/* <input type="number" className="form-control"
            onChange={e => updateFormInput({ ...formInput, verificationDetails: e.target.value })}
            placeholder="e. g. Enter Your Adharcard Number"></input> */}

        </div>

        <div className="space-y-10">
          <span htmlFor="name" id="span_Id" className="nameInput">lat : {nft.houseAddress.split(',')[0]} </span>
          <span htmlFor="name" id="span_Id" className="nameInput">lang : {nft.houseAddress.split(',')[1]} </span>
          
        </div>

      

        <button >get location</button>
        <div className="space-y-10">
          <div className="d-flex flex-column flex-md-row">
            <button>Register house</button>
          </div>
        </div>
      </div>
      ))}
    </>
 
  )
}

export default MyDetails