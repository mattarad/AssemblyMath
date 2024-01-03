const {
  loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("AssemblyMath", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployAssemblyMathFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const MAX_INT = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    const BASE = 100

    const AssemblyMath = await ethers.getContractFactory("AssemblyMath");
    const amath = await AssemblyMath.deploy();

    return { amath, MAX_INT, BASE };
  }


  describe("contract", function () {
    describe("yul_add", function () {
      it("should return correct sum of two numbers", async function () {
        const { amath } = await loadFixture(deployAssemblyMathFixture);
        let num_one = Math.floor(Math.random() * 1000000)
        let num_two = Math.floor(Math.random() * 1000000)
        let sum = num_one + num_two

        let contract_sum = await amath.yul_add(num_one, num_two)
        expect(contract_sum).to.eq(sum)


      });

      it("should revert due to overflow", async function () {
        const { amath, MAX_INT } = await loadFixture(
          deployAssemblyMathFixture
        );

        let num_one = Math.floor(Math.random() * 1000000)

        await expect(amath.yul_add(num_one, MAX_INT)).to.be.reverted;
      });

    });
    describe("yul_mul", function () {
      it("should return correct product of two numbers", async function () {
        const { amath } = await loadFixture(deployAssemblyMathFixture);
        let num_one = Math.floor(Math.random() * 100)
        let num_two = Math.floor(Math.random() * 100)
        let prod = num_one * num_two

        let contract_prod = await amath.yul_mul(num_one, num_two)
        expect(contract_prod).to.eq(prod)


      });

      it("should revert due to overflow", async function () {
        const { amath, MAX_INT } = await loadFixture(
          deployAssemblyMathFixture
        );

        let num_one = Math.floor(Math.random() * 10)
        num_one = num_one == 0 ? 10 : num_one

        await expect(amath.yul_mul(num_one, MAX_INT)).to.be.reverted;
      });
      it("should return 0 if first param is 0", async function () {
        const { amath, MAX_INT } = await loadFixture(
          deployAssemblyMathFixture
        );
        let num_one = 0
        let res = await amath.yul_mul(num_one, MAX_INT)

        expect(res).to.eq(0);
      });

    });
    describe("yul_fixed_point_round", function () {
      it("should round to nearest multiple of BASE", async function () {
        const { amath, BASE } = await loadFixture(deployAssemblyMathFixture);
        const NUM_TESTS = 15
        for(let i = 0; i < NUM_TESTS; i++) {
          let num_one = Math.floor(Math.random() * 100)
          num_one = num_one == 0 ? (num_one + 1) : num_one
  
          let result = (num_one + (BASE / 2))
          result = Math.floor(result / BASE) * BASE
  
          let contract_round = await amath.yul_fixed_point_round(num_one, BASE)
  
          expect(contract_round).to.eq(result)
        }
      });
    });
    describe("sub", function () {
      it("should return correct difference of two numbers", async function () {
        const { amath } = await loadFixture(deployAssemblyMathFixture);
        let num_one = Math.floor(Math.random() * 1000000)
        let num_two = Math.floor(Math.random() * 1000000)
        let first = num_one > num_two ? num_one : num_two
        let second = num_one > num_two ? num_two : num_one
        let difference = first - second

        let contract_difference = await amath.sub(first, second)
        expect(contract_difference).to.eq(difference)


      });

      it("should revert due to underflow", async function () {
        const { amath } = await loadFixture(
          deployAssemblyMathFixture
        );
        let num_one = Math.floor(Math.random() * 1000000)
        let num_two = Math.floor(Math.random() * 1000000)
        let first = num_one < num_two ? num_one : num_two
        let second = num_one < num_two ? num_two : num_one

        await expect(amath.sub(first, second)).to.be.reverted;
      });

    });
    describe("fixed_point_mul", function () {
      it("should return product of two numbers - no decimals", async function () {
        const { amath, BASE } = await loadFixture(deployAssemblyMathFixture);
        let num_one = Math.floor(Math.random() * 10)
        let num_two = Math.floor(Math.random() * 10)
        num_one = num_one == 0 ? (num_one + 1) * BASE : num_one * BASE
        num_two = num_two == 0 ? (num_two + 1) * BASE : num_two * BASE

        let result = (((num_one) * (num_two)) / BASE) / BASE

        let res = await amath.fixed_point_mul(num_one, num_two, BASE)
        expect(res).to.eq(result)


      });

      it("should revert due to overflow", async function () {
        const { amath, MAX_INT, BASE } = await loadFixture(
          deployAssemblyMathFixture
        );

        let num_one = Math.floor(Math.random() * 10)
        num_one = num_one < 10 ? 10 : num_one

        await expect(amath.fixed_point_mul(num_one, MAX_INT, BASE)).to.be.reverted;
      });
      it("should return 0 if first param is 0", async function () {
        const { amath, MAX_INT, BASE } = await loadFixture(
          deployAssemblyMathFixture
        );
        let num_one = 0
        let res = await amath.fixed_point_mul(num_one, MAX_INT, BASE)

        expect(res).to.eq(0);
      });

    });
  });
});
