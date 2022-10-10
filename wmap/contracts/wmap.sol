// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

// waste menagement assistive protocol
contract WMAP is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;
    address payable owner;

    constructor() ERC721("QRNFT", "RXP") {
    owner = payable(msg.sender);
    }

    mapping(uint256 => House) private idToHouse;
    mapping(uint256 => garbageCollection) private idToGarbage;

    // Home Details
    struct House {
        uint256 tokenId;
        uint256 noOfPeople;
        string OwnerName;
        address OwnerAddress;
        string houseAddress;
        string[] memberName;
        uint256[] verificationDetails;
    }

    // Garbage Data
    struct garbageCollection{
        uint256 tokenId;
        uint256 garbageValue;
        uint256 garbageCollecteddays;
        int rewardPoints;
        uint256 penaltymonths;
        uint256 garbageWeightLimit;
        uint256 garbageCollectedTime;
        string location;
    }

    // Register A New House
    function registerHouse(string memory OwnerName,uint256 verificationDetails,string memory houseAddress) public {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();
        _mint(msg.sender, newTokenId);
        idToHouse[tokenIds.current()].OwnerName = OwnerName;
        idToHouse[tokenIds.current()].OwnerAddress = msg.sender;
        idToHouse[tokenIds.current()].houseAddress = houseAddress;
        idToHouse[tokenIds.current()].verificationDetails.push(verificationDetails);
        registerOwner(newTokenId, OwnerName);

    }

    // Register or Change Ownership
    function registerOwner(uint256 tokenId, string memory OwnerName) public {
        require(msg.sender == idToHouse[tokenId].OwnerAddress, "only owner can change ownership");
        int rewardPoint = 0;
        uint256 noOfPeople = 1;
        uint256 garbageWeightLimit = noOfPeople*2;
        idToHouse[tokenId].tokenId = tokenId;
        idToHouse[tokenId].noOfPeople = noOfPeople;
        idToHouse[tokenId].memberName.push(OwnerName);
        idToGarbage[tokenId].garbageWeightLimit = garbageWeightLimit;
        idToGarbage[tokenId].rewardPoints = rewardPoint;
        idToGarbage[tokenId].garbageCollecteddays = 0;
    }

    // register a new member in House
    function registerNewMember(uint tokenId,string memory memberName, uint256 verificationDetails) public {
        require(msg.sender == idToHouse[tokenId].OwnerAddress, "only owner can add member");
        House storage member = idToHouse[tokenId];
        member.noOfPeople += 1;
        idToGarbage[tokenId].garbageWeightLimit = member.noOfPeople*2;
        member.memberName.push(memberName);
        member.verificationDetails.push(verificationDetails);
    }

    // Remove existing member
    function removeExistingMember(uint tokenId, uint256 verificationDetails) public {
        require(msg.sender == idToHouse[tokenId].OwnerAddress, "only owner can remove member");
        House storage member = idToHouse[tokenId];
        for (uint256 i = 0; i < member.verificationDetails.length; i++) {
            if (member.verificationDetails[i] == verificationDetails) {
                delete member.verificationDetails[i];
                delete member.memberName[i];
                member.noOfPeople -= 1;
                idToGarbage[tokenId].garbageWeightLimit = member.noOfPeople*2;
            }
        }
    }

    // daily garbage collection data and reward distribution
    function garbageRecord(uint256 tokenId, uint256 garbageValue, string memory location) public{
        uint256 timestemp = block.timestamp;
        idToGarbage[tokenId].tokenId = tokenId;
        idToGarbage[tokenId].garbageValue = garbageValue;
        idToGarbage[tokenId].location = location;
        idToGarbage[tokenId].garbageCollectedTime = timestemp;
        idToGarbage[tokenId].garbageCollecteddays += 1;
        if(garbageValue <= idToGarbage[tokenId].garbageWeightLimit){
            idToGarbage[tokenId].rewardPoints += 1;
        }
        else{
            idToGarbage[tokenId].rewardPoints -= 1;
        }
        if(idToGarbage[tokenId].garbageCollecteddays == 29){
            if(idToGarbage[tokenId].rewardPoints >= 17) {
                // user got rewarded
                idToGarbage[tokenId].penaltymonths = 0;
            }
            else if(idToGarbage[tokenId].rewardPoints == 16){
                idToGarbage[tokenId].penaltymonths = 0;
                // user got no reward or penalty
            }
            else if(idToGarbage[tokenId].rewardPoints <= 15){
                // user got penalty
                idToGarbage[tokenId].penaltymonths += 1;
                if(idToGarbage[tokenId].penaltymonths == 3){
                    console.log("your activity is suspicious and under review");
                }
            }
            idToGarbage[tokenId].garbageCollecteddays = 0;
            idToGarbage[tokenId].rewardPoints = 0;
        }
    }

    // get House details
    function getHomeDetails(uint256 tokenId) public view returns (House memory) {
        House memory items = idToHouse[tokenId];
        return items;
    }

    // get garbage collection details
    function getGarbageCollectionDetails(uint256 tokenId) public view returns (garbageCollection memory) {
        garbageCollection memory items = idToGarbage[tokenId];
        return items;
    }

    function fetchHouse() public view returns (House[] memory) {
      uint totalItemCount = tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToHouse[i + 1].OwnerAddress == msg.sender) {
          itemCount += 1;
        }
      }
      House[] memory items = new House[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToHouse[i + 1].OwnerAddress == msg.sender) {
          uint currentId = i + 1;
          House storage currentItem = idToHouse[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}