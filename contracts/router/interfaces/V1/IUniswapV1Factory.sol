// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IUniswapV1Factory {
    function getExchange(address) external view returns (address);
}
