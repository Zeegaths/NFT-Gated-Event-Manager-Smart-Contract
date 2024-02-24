// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract NftGatedEvent {
    address public eventNft;

    uint public eventCount;

    struct Event{
        uint eventId;
        string eventTitle;
        string description;
        string venue;
        address [] registeredUsers;
        string eventDate;
    }

    Event[] EventsArray;

    mapping(uint256 => Event) events;
    mapping(uint256 => mapping(address => bool)) public hasUserRegistered;

    constructor(address _nft) {
        eventNft = _nft;
    }


    function createEvent(string memory _title, string memory _description, string memory _venue, string memory _date) external {

        uint256 eventID = eventCount + 1;

        Event storage event_ = events[eventID];

        event_.eventId = eventID;
        event_.eventTitle = _title;
        event_.description = _description;
        event_.venue = _venue;
        event_.eventDate= _date;

        EventsArray.push(event_);

        eventCount =  eventCount + 1;
    }

    function registerForEvent(uint256 _Id) external {
        require(IERC721(eventNft).balanceOf(msg.sender) > 0 , "not elligible for event");
        require(!hasUserRegistered[_Id][msg.sender], "already registered");

        Event storage _event = events[_Id];
        _event.registeredUsers.push(msg.sender);
        hasUserRegistered[_Id][msg.sender] = true;
    }

    function getAllEvents() external view returns(Event[] memory) {
        return EventsArray;
    }

    function viewEvent(uint _eventId) external view returns (Event memory) {
        return events[_eventId];
    }

    function checkRegistrationValidity(uint _eventId, address _user) external view returns(bool) {
        return hasUserRegistered[_eventId][_user];
    }

}