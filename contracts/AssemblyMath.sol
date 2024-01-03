// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract AssemblyMath {
    error Overflow();
    error Underflow();

    function yul_add(uint x, uint y) public pure returns (uint z) {
        assembly {
            z := add(x, y)
            if lt(z, x) {
                revert(0, 0)
            }
        }
    }

    function yul_mul(uint x, uint y) public pure returns (uint z) {
        assembly {
            switch x
            case 0 {
                z := 0
            }
            default {
                z := mul(x, y)
                if iszero(eq(div(z, x), y)) {
                    revert(0, 0)
                }
            }
        }
    }

    function yul_fixed_point_round(
        uint x,
        uint b
    ) public pure returns (uint z) {
        assembly {
            let half := div(b, 2)
            z := add(x, half)
            z := mul(div(z, b), b)
        }
    }

    function sub(uint x, uint y) public pure returns (uint z) {
        assembly {
            if lt(x, y) {
                revert(0, 0)
            }
            z := sub(x, y)
        }
    }

    function fixed_point_mul(
        uint x,
        uint y,
        uint b
    ) public pure returns (uint z) {
        assembly {
            switch x
            case 0 {
                z := 0
            }
            default {
                z := mul(x, y)

                if iszero(eq(div(z, x), y)) {
                    revert(0, 0)
                }
                z := div(div(z, b), b)
            }
        }
    }
}
