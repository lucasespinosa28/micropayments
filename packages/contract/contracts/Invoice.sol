// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Invoice is Ownable {
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

    constructor(
        address initialOwner
    ) Ownable(initialOwner) {}

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

    function updateBanned(
        address[] memory _address,
        bool[] memory _blocked
    ) external {
        require(
            _address.length == _blocked.length,
            "Both address and blocked need to be same length"
        );
        for (uint256 i = 0; i < _blocked.length; i++) {
            if (_blocked[i]) {
                Banned[msg.sender][_address[i]] = true;
            } else {
                delete Banned[msg.sender][_address[i]];
                delete bannedList[msg.sender][i];
            }
        }
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
        require(payments[id].length > 0, "It Id was used");
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
                    history[receiver[i]].push(id);
                } else {
                    history[payer[i]].push(id);
                    history[receiver[i]].push(id);
                }
            }
        }
    }

    function sendPayment(bytes32 id, uint256 index) external returns (bool) {
        require(
            IERC20(payments[id][index].token).balanceOf(msg.sender) >
                payments[id][index].amount,
            "insuffient token balance"
        );
        bool result = IERC20(payments[id][index].token).transferFrom(
            msg.sender,
            address(this),
            payments[id][index].amount
        );
        return result;
    }

    function sendAllPayment(bytes32 id, uint256[] memory index) external {
        for (uint256 i = 0; i < index.length; i++) {
            require(
                IERC20(payments[id][index[i]].token).balanceOf(msg.sender) >
                    payments[id][index[i]].amount,
                "insuffient token balance"
            );
            bool result = IERC20(payments[id][index[i]].token).transferFrom(
                msg.sender,
                address(this),
                payments[id][index[i]].amount
            );
            require(result, "fail to send token");
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
        bool result = IERC20(payments[id][index].token).transferFrom(
            address(this),
            payments[id][index].payer,
            payments[id][index].amount
        );
        if (result == false) {
            revert("Error to transfer amount to receiver account.");
        }
        payments[id][index].paid = true;
    }

    function cancel(bytes32 id, uint256 index) external {
        require(
            payments[id][index].payer == msg.sender,
            "Only payer is allwod to cancel payment."
        );
        bool result = IERC20(payments[id][index].token).transferFrom(
            address(this),
            payments[id][index].payer,
            payments[id][index].amount
        );
        if (result == false) {
            revert("Error to transfer amount to payer account.");
        }
        delete payments[id][index];
    }
}
