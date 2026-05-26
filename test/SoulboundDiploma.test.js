import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("SoulboundDiploma", () => {
  let contract;
  let owner;
  let student;
  let other;

  const SAMPLE = {
    studentName: "Alice Dupont",
    degree: "Master of Science in Computer Engineering",
    major: "Blockchain & Distributed Systems",
    graduationYear: 2026,
    metadataURI: "ipfs://QmExampleHash",
  };

  beforeEach(async () => {
    [owner, student, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SoulboundDiploma");
    contract = await Factory.deploy();
  });

  describe("Deployment", () => {
    it("sets the deployer as owner", async () => {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("initializes with zero diplomas", async () => {
      expect(await contract.totalIssued()).to.equal(0);
    });
  });

  describe("issueDiploma", () => {
    it("allows owner to mint a diploma", async () => {
      await expect(
        contract.issueDiploma(
          student.address,
          SAMPLE.studentName,
          SAMPLE.degree,
          SAMPLE.major,
          SAMPLE.graduationYear,
          SAMPLE.metadataURI
        )
      )
        .to.emit(contract, "DiplomaIssued")
        .withArgs(0, student.address, SAMPLE.studentName, SAMPLE.degree, SAMPLE.graduationYear);

      expect(await contract.totalIssued()).to.equal(1);
      expect(await contract.ownerOf(0)).to.equal(student.address);
    });

    it("reverts when called by non-owner", async () => {
      await expect(
        contract
          .connect(other)
          .issueDiploma(
            student.address,
            SAMPLE.studentName,
            SAMPLE.degree,
            SAMPLE.major,
            SAMPLE.graduationYear,
            SAMPLE.metadataURI
          )
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });

    it("reverts on empty student name", async () => {
      await expect(
        contract.issueDiploma(
          student.address,
          "",
          SAMPLE.degree,
          SAMPLE.major,
          SAMPLE.graduationYear,
          SAMPLE.metadataURI
        )
      ).to.be.revertedWith("SoulboundDiploma: name required");
    });

    it("reverts on invalid graduation year", async () => {
      await expect(
        contract.issueDiploma(
          student.address,
          SAMPLE.studentName,
          SAMPLE.degree,
          SAMPLE.major,
          1999,
          SAMPLE.metadataURI
        )
      ).to.be.revertedWith("SoulboundDiploma: invalid year");
    });
  });

  describe("getDiploma / diplomasOf", () => {
    beforeEach(async () => {
      await contract.issueDiploma(
        student.address,
        SAMPLE.studentName,
        SAMPLE.degree,
        SAMPLE.major,
        SAMPLE.graduationYear,
        SAMPLE.metadataURI
      );
    });

    it("returns correct diploma data", async () => {
      const diploma = await contract.getDiploma(0);
      expect(diploma.studentName).to.equal(SAMPLE.studentName);
      expect(diploma.degree).to.equal(SAMPLE.degree);
      expect(diploma.graduationYear).to.equal(SAMPLE.graduationYear);
    });

    it("returns token list for holder", async () => {
      const tokens = await contract.diplomasOf(student.address);
      expect(tokens).to.have.lengthOf(1);
      expect(tokens[0]).to.equal(0);
    });

    it("returns correct tokenURI", async () => {
      expect(await contract.tokenURI(0)).to.equal(SAMPLE.metadataURI);
    });
  });

  describe("Soulbound transfers", () => {
    beforeEach(async () => {
      await contract.issueDiploma(
        student.address,
        SAMPLE.studentName,
        SAMPLE.degree,
        SAMPLE.major,
        SAMPLE.graduationYear,
        SAMPLE.metadataURI
      );
    });

    it("reverts on transferFrom", async () => {
      await expect(
        contract.connect(student).transferFrom(student.address, other.address, 0)
      ).to.be.revertedWithCustomError(contract, "SoulboundTransferForbidden");
    });

    it("reverts on safeTransferFrom", async () => {
      await expect(
        contract
          .connect(student)
          ["safeTransferFrom(address,address,uint256,bytes)"](student.address, other.address, 0, "0x")
      ).to.be.revertedWithCustomError(contract, "SoulboundTransferForbidden");
    });

    it("reverts on approve", async () => {
      await expect(
        contract.connect(student).approve(other.address, 0)
      ).to.be.revertedWithCustomError(contract, "SoulboundTransferForbidden");
    });

    it("reverts on setApprovalForAll", async () => {
      await expect(
        contract.connect(student).setApprovalForAll(other.address, true)
      ).to.be.revertedWithCustomError(contract, "SoulboundTransferForbidden");
    });
  });
});
