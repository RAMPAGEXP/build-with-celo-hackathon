import React, { useState, useEffect } from 'react'
import { wmap_comm_address } from '../config_comm'
import WMAP_COMM from '../WMAP_COMMUNITY.json'
import { ethers } from 'ethers'
// import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useNavigate } from 'react-router-dom'

const Services = () => {
  const [formInput, updateFormInput] = useState({ memberName: '', tokenId: '', member_Aadharcard: '', removeAadharMember: '', newOwnerName: '', verificationDetails2: [''], verificationDetails3: [''], verificationDetails1: [''] })
  const [walletAddress, setWalletAddress] = useState("");
  const [nfts, setNfts] = useState([])
  const client = ipfsHttpClient('https://wmap.infura.io:5001/api/v0')

  // fetch wallet address
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

  useEffect(() => {
    loadNFTs()
  }, [])


  // Load nft's data
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    if (typeof window.ethereum !== 'undefined') {
      // await addNetwork();
      await requestAccount();

      // const provider = new ethers.providers.Web3Provider(window.ethereum);
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

        nameOfMembers: i.memberName
        // tokenURI
      }
      return item

    }))
    setNfts(items)
    console.log(items)

  }

  // Ipfs
  async function uploadToIPFS() {
    const { OwnerName, verificationDetails, houseAddress, memberName } = formInput
    if (!OwnerName || !verificationDetails || !houseAddress || !memberName) return
    /* first, upload to IPFS #####auctionprice*/
    const data = JSON.stringify({
      OwnerName, verificationDetails, houseAddress, memberName,
    })
    try {
      const added = await client.add(data)
      const url = `https://wmap.infura-ipfs.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  // Register New Member
  async function registerNewMember() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const MemberName = formInput.memberName;
    let verificationDetails = formInput.verificationDetails1 + ' ' + formInput.verificationDetails2 + ' ' + formInput.verificationDetails3;
    var regexp = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
    //Pass Direct Value Of Live Loction
    let contract = new ethers.Contract(wmap_comm_address, WMAP_COMM.abi, signer)
    var x = verificationDetails;
    if (regexp.test(x)) {
      console.log(formInput.tokenId)
      let tokenid = document.getElementById("tokenId").value;
      let aadharnumber = formInput.verificationDetails1 + formInput.verificationDetails2 + formInput.verificationDetails3;
      let transaction = await contract.registerNewMember(tokenid, MemberName, aadharnumber)
      await transaction.wait()
      alert("member registered")
    }
    else {
      window.alert("Invalid Aadhar no.");
    }
  }

  // Remove Existing Member
  async function removeMember() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let tokenid = document.getElementById("tokenId").value;
    let contract = new ethers.Contract(wmap_comm_address, WMAP_COMM.abi, signer)
    let aadharnumber = formInput.verificationDetails1 + formInput.verificationDetails2 + formInput.verificationDetails3;
    let transaction = await contract.removeExistingMember(tokenid, aadharnumber)
    await transaction.wait()
    alert("member removed")
  }

  // change ownership
  async function changeOwner() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let tokenid = document.getElementById("tokenId").value;
    const OwnerName = formInput.newOwnerName;
    const aadharnumber = formInput.verificationDetails1 + formInput.verificationDetails2 + formInput.verificationDetails3;
    let contract = new ethers.Contract(wmap_comm_address, WMAP_COMM.abi, signer)
    let transaction = await contract.registerOwner(tokenid, OwnerName, aadharnumber)
    await transaction.wait()
    alert("Owner Updated")

  }

  return (
    <>
      {nfts.map((nft, i) => (
        <div className="space-y-20">
          <div>
            <h3>Register new member</h3>
            <div className="space-y-10">
              <span htmlFor="name" className="nameInput">Member Name</span>
              <input id="name" type="text" className="form-control"
                placeholder="member's name"
                onChange={e => updateFormInput({ ...formInput, memberName: e.target.value })} />
            </div>
            <div className="space-y-10">
              <input type="hidden" id="tokenId" className="form-control"
                placeholder="member's name"
                value={nft.tokenId}
              />
            </div>

            <div className="space-y-10">
              <span className="nameInput">Verification Details: </span>

              <input type="text" id="pin1" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails1: e.target.value })} />

              <input type="text" id="pin2" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails2: e.target.value })} />

              <input type="text" id="pin3" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails3: e.target.value })} />

            </div>
            <button onClick={registerNewMember}>register</button>
          </div>

          <br />
          <br />
          <div>
            <h3>Remove Existing Member</h3>
            <input type="text" id="pin1" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails1: e.target.value })} />

            <input type="text" id="pin2" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails2: e.target.value })} />

            <input type="text" id="pin3" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails3: e.target.value })} />
          </div>
          <button onClick={removeMember}>remove</button>

          <br />
          <br />
          <div>
            <h3>Change Ownership</h3>
            <div className="space-y-10">
              <span htmlFor="name" className="nameInput">New Ownername: </span>
              <input id="name" type="text" className="form-control"
                placeholder="Owner Name"
                onChange={e => updateFormInput({ ...formInput, newOwnerName: e.target.value })} />
            </div>

            <div className="space-y-10">
            <span htmlFor="name" className="nameInput">New Owner Aadharcard Number: </span>
            <input type="text" id="pin1" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails1: e.target.value })} />

            <input type="text" id="pin2" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails2: e.target.value })} />

            <input type="text" id="pin3" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails3: e.target.value })} />
          </div>
          <button onClick={changeOwner}>change</button>
        </div>
      </div>
  ))
}
  </>
)
}

export default Services