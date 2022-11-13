// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

// waste menagement assistive protocol
contract WMAP_COMMUNITY is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;
    Counters.Counter private vehicleId;
    address payable owner;

    constructor() ERC721("QRNFT", "RXP") {
    owner = payable(msg.sender);
    }

    mapping(uint256 => House) private idToHouse;
    
    // Home Details
    struct House {
        uint256 tokenId;
        uint256 noOfPeople;
        string OwnerName;
        uint256 OwnerVerificationDetails;
        address OwnerWalletAddress;
        string houseAddress;
        uint256 garbageWeightLimit;
        string[] memberName;
        uint256[] verificationDetails;
    }

    // Register A New House
    function registerHouse(string memory OwnerName,uint256 verificationDetails, string memory houseAddress ) public {
        uint totalItemCount = tokenIds.current();
        address tempOwner;
        for (uint i = 0; i < totalItemCount; i++) {
          if (idToHouse[i + 1].OwnerWalletAddress == msg.sender) {
            tempOwner = msg.sender;
          }
        }
        require(tempOwner != msg.sender,"Owner Already Exist");
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();
        _mint(msg.sender, newTokenId);
        idToHouse[tokenIds.current()].OwnerName = OwnerName;
        idToHouse[tokenIds.current()].OwnerWalletAddress = msg.sender;
        idToHouse[tokenIds.current()].houseAddress = houseAddress;
        registerOwner(newTokenId, OwnerName, verificationDetails);

    }

    // Register or Change Ownership
    function registerOwner(uint256 tokenId, string memory OwnerName, uint verificationDetails) public {
        require(msg.sender == idToHouse[tokenId].OwnerWalletAddress, "only owner can change ownership");
        // uint256 garbageWeightLimit = 2;
        idToHouse[tokenId].tokenId = tokenId;
        idToHouse[tokenId].noOfPeople = 1;
        idToHouse[tokenId].memberName.push(OwnerName);
        idToHouse[tokenId].verificationDetails.push(verificationDetails);
        idToHouse[tokenId].garbageWeightLimit = 2;
        idToHouse[tokenId].OwnerName = OwnerName;
        idToHouse[tokenId].OwnerVerificationDetails = verificationDetails;
    }

    // register a new member in House
    function registerNewMember(uint tokenId,string memory memberName, uint256 verificationDetails) public {
        require(msg.sender == idToHouse[tokenId].OwnerWalletAddress, "only owner can add member");
        House storage member = idToHouse[tokenId];
        member.noOfPeople += 1;
        idToHouse[tokenId].garbageWeightLimit = member.noOfPeople*2;
        member.memberName.push(memberName);
        member.verificationDetails.push(verificationDetails);
    }

    // Remove existing member
    function removeExistingMember(uint tokenId, uint256 verificationDetails) public {
        require(msg.sender == idToHouse[tokenId].OwnerWalletAddress, "only owner can remove member");
        House storage member = idToHouse[tokenId];
        for (uint256 i = 0; i < member.verificationDetails.length; i++) {
            if (member.verificationDetails[i] == verificationDetails) {
                delete member.verificationDetails[i];
                delete member.memberName[i];
                member.noOfPeople -= 1;
                idToHouse[tokenId].garbageWeightLimit = member.noOfPeople*2;
            }
        }
    }

    // get House details
    function getHomeDetails(uint256 tokenId) public view returns (House memory) {
        House memory items = idToHouse[tokenId];
        return items;
    }

    // fetch house
    function fetchHouse() public view returns (House[] memory) {
      uint totalItemCount = tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToHouse[i + 1].OwnerWalletAddress == msg.sender) {
          itemCount += 1;
        }
      }
      House[] memory items = new House[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToHouse[i + 1].OwnerWalletAddress == msg.sender) {
          uint currentId = i + 1;
          House storage currentItem = idToHouse[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}