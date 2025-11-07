// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SalonRegistry {
    address public owner;
    string public salonName;
    string public city;

    event Booking(address indexed client, uint256 time, string service);

    constructor(string memory _name, string memory _city) {
        owner = msg.sender;
        salonName = _name;
        city = _city;
    }

    function book(string calldata service) external {
        emit Booking(msg.sender, block.timestamp, service);
    }
}
