import React, { useState, useEffect } from 'react'
import '../bootstrap-4.0.0-beta.2-dist/css/bootstrap.min.css'
import '../App.css'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { wmap_comm_address } from '../config_comm'
import WMAP_COMM from '../WMAP_COMMUNITY.json'
import { wmap_org_address } from '../config_org'
import WMAP_ORG from '../WMAP_ORGANIZATION.json'
import { useNavigate } from 'react-router-dom'
import QRCode from "react-qr-code";

const client = ipfsHttpClient('https://wmap.infura.io:5001/api/v0')
function MyDetails() {
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate()
  const [nfts, setNfts] = useState([])
  const [garbageRecord, setGarbageRecord] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')


  useEffect(() => {
    loadNFTs()
  }, [])

  async function requestAccount() {
    // console.log('Requesting account...');

    // ❌ Check if Meta Mask Extension exists 
    if (window.ethereum) {
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

  // load nft
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
    }
    const marketplaceContract = new ethers.Contract(wmap_comm_address, WMAP_COMM.abi, signer)
    const data = await marketplaceContract.fetchHouse()

    const items = await Promise.all(data.map(async i => {
      let item = {
        // OwnerName,
        tokenId: i.tokenId.toString(),
        // seller: i.seller,
        owner: i.OwnerWalletAddress,
        OwnerName: i.OwnerName,
        OwnerVerificationDetails: i.OwnerVerificationDetails,
        houseAddress: i.houseAddress,
        houseAddress: i.houseAddress,
        verificationDetalis: i.verificationDetails,
        nameOfMembers: i.memberName,
        weightLimit: i.garbageWeightLimit
      }
      return item

    }))
    setNfts(items)
    console.log(items)
    setLoadingState('loaded')
    // return(account)

  }



      // fetch garbage record
      async function getGarbageDetails() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let tokenid = document.getElementById("tokenId").value;
        let contract = new ethers.Contract(wmap_org_address, WMAP_ORG.abi, signer)
        let transaction = await contract.getGarbageCollectionDetails(tokenid);
        // await transaction.wait()
        console.log(transaction)
        document.getElementById("garbageRecord").innerHTML = `<div> 
        <span>collected days: ${transaction.garbageCollecteddays}</span> <br />
        <span>Collected time: ${transaction.garbageCollectedTime}</span> <br />
        <span>Collected Location: ${transaction.location}</span> <br />
        <span>Garbage Value: ${transaction.garbageValue}</span> <br />
        <span>monthly rewards point: ${transaction.rewardPoints}</span> <br />
        <span>penalty points: ${transaction.penaltymonths}</span> <br />
        </div>`
        // alert("Garbage Collected")
    }

  return (
    <>
      {nfts.map((nft, i) => (

        <div className="space-y-20" key={i}>
          <div className="space-y-10">
            
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "15%", width: "15%" }}
                value={nft.tokenId}
                viewBox={`0 0 256 256`}
              />
          </div>

          <div className="space-y-10">
            <span htmlFor="name" className="nameInput">Owner Name: </span>
            <span id='ownerName'>{nft.OwnerName}</span>
          </div>

          <div className="space-y-10">
            <span className="nameInput">Verification Details: </span>
            <span id='ownerVerification'>{nft.OwnerVerificationDetails.toString()}</span>
          </div>

          <div className="space-y-10">
            <span className="nameInput">Members Name: </span>
            <span id='membername'>{nft.nameOfMembers.toString() }</span>
            <br />
            <span className="nameInput">Members Aadharcard: </span>
            <span id='verification'>{nft.verificationDetalis.toString() }</span>
          </div>

          <div className="space-y-10">
            <span htmlFor="name" id="span_Id" className="nameInput">Address: {nft.houseAddress} </span>
          </div>

          <div className="space-y-10">
            <span htmlFor="name" className="nameInput">Garbage Limit: {nft.weightLimit.toString()} </span>
          </div>
         <br />
         <br />
          <div>
            <button onClick={getGarbageDetails}>get your garbage data</button>
            <input type="hidden" id='tokenId' value={nft.tokenId} />
            <br />
            <span id='garbageRecord'></span>

          </div>

        </div>
      ))}
    </>

  )
}

export default MyDetails