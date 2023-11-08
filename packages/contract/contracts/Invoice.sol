// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Invoice is Ownable {
    function getBlockTime() external view returns (uint256) {
        return block.timestamp;
    }

    mapping(address => bool) internal blocked;
    mapping(address => mapping(address => bool)) internal Banned;
    mapping(address => address[]) internal bannedList;
    mapping(bytes32 => Payment[]) internal payments;
    mapping(address => bytes32[]) internal history;

    struct Payment {
        uint256 dateTime;
        address token;
        uint256 amount;
        address payer;
        address receiver;
        bool paid;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    function getHistory(
        address _address
    ) external view returns (bytes32[] memory) {
        return history[_address];
    }

    function setBlock(bool _block) external {
        blocked[msg.sender] = _block;
    }

    function isBlocked(address _address) external view returns (bool) {
        return blocked[_address];
    }

    function getBannedList(
        address _address
    ) external view returns (address[] memory) {
        return bannedList[_address];
    }

    function updateBanned(address[] memory _address) external {
        if (bannedList[msg.sender].length > 0) {
            for (uint256 i = 0; i < _address.length; i++) {
                delete Banned[msg.sender][_address[i]];
            }
        }
        delete bannedList[msg.sender];
        for (uint256 i = 0; i < _address.length; i++) {
            Banned[msg.sender][_address[i]] = true;
            bannedList[msg.sender].push(_address[i]);
        }
    }

    function getPayment(bytes32 id) external view returns (Payment[] memory) {
        return payments[id];
    }

    /// @notice create an new payment
    /// @param id,dateTime[],token[],amount[],payer[],receiver[] and  paid
    function createPayment(
        bytes32 id,
        uint256[] calldata dateTime,
        address[] calldata token,
        uint256[] calldata amount,
        address[] calldata payer,
        address[] calldata receiver
    ) external {
        require(payments[id].length == 0, "It Id was used");
        require(
            dateTime.length == token.length &&
                token.length == amount.length &&
                amount.length == payer.length &&
                payer.length == receiver.length &&
                receiver.length == dateTime.length,
            "Every array need be same length"
        );
        for (uint256 i = 0; i < receiver.length; i++) {
            {
                if (amount[i] == 0) {
                    revert("Error: Amount of tokens transfer is not zero.");
                }
                if (msg.sender != payer[i] && blocked[payer[i]]) {
                    revert("It account is no allowed to ask for payment");
                }
                if (Banned[payer[i]][receiver[i]] == true) {
                    revert(
                        "It account is no allowed this account to ask for payment"
                    );
                }
                Payment memory newPayment = Payment(
                    dateTime[i],
                    token[i],
                    amount[i],
                    payer[i],
                    receiver[i],
                    false
                );
                payments[id].push(newPayment);
                if (payer[i] == receiver[i]) {
                    uint256 lastIndex = history[receiver[i]].length;

                    if (lastIndex == 0) {
                        history[receiver[i]].push(id);
                    } else {
                        if (history[receiver[i]][lastIndex - 1] != id) {
                            history[receiver[i]].push(id);
                        }
                    }
                } else {
                    uint256 payerlastIndex = history[payer[i]].length;
                    if (payerlastIndex == 0) {
                        history[payer[i]].push(id);
                    } else {
                        if (history[payer[i]][payerlastIndex - 1] != id) {
                            history[payer[i]].push(id);
                        }
                    }
                    uint256 receiverlastIndex = history[receiver[i]].length;
                    if (receiverlastIndex == 0) {
                        history[receiver[i]].push(id);
                    } else {
                        if (history[receiver[i]][receiverlastIndex - 1] != id) {
                            history[receiver[i]].push(id);
                        }
                    }
                }
            }
        }
    }

    function sendPayment(bytes32 id, uint256 index) external {
        require(
            IERC20(payments[id][index].token).balanceOf(msg.sender) >
                payments[id][index].amount,
            "insuffient token balance"
        );
        require(
            IERC20(payments[id][index].token).transferFrom(
                msg.sender,
                address(this),
                payments[id][index].amount
            ),
            "token transfer from sender failed"
        );
    }

    function sendAllPayment(bytes32 id, uint256[] memory index) external {
        for (uint256 i = 0; i < index.length; i++) {
            require(
                IERC20(payments[id][index[i]].token).balanceOf(msg.sender) >
                    payments[id][index[i]].amount,
                "insuffient token balance"
            );

            require(
                IERC20(payments[id][i].token).transferFrom(
                    msg.sender,
                    address(this),
                    payments[id][i].amount
                ),
                "token transfer from sender failed"
            );
        }
    }

    function confirm(bytes32 id, uint256 index) external {
        require(
            payments[id][index].receiver == msg.sender,
            "Its payment is not for this account."
        );
        require(
            payments[id][index].dateTime <= block.timestamp,
            "Timer not locked."
        );
        require(
            IERC20(payments[id][index].token).transfer(
                payments[id][index].receiver,
                payments[id][index].amount
            ),
            "token transfer from sender failed"
        );
        payments[id][index].paid = true;
    }

    function cancel(bytes32 id, uint256 index) external {
        require(
            payments[id][index].payer == msg.sender,
            "Only payer is allwod to cancel payment."
        );
        require(
            IERC20(payments[id][index].token).transfer(
                payments[id][index].payer,
                payments[id][index].amount
            ),
            "token transfer from sender failed"
        );
        delete payments[id][index];
    }
}
