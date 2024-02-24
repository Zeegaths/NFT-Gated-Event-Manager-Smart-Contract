import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";



describe("NFT-Gated Event", function () {
  async function deployNftGatedEventFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ZarahNft = await ethers.getContractFactory("ZarahNft");
    const zarahNft = await ZarahNft.deploy();


    const NftGatedEvent = await ethers.getContractFactory("NftGatedEvent");
    const nftGatedEvent = await NftGatedEvent.deploy(zarahNft);

    return { zarahNft, nftGatedEvent, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      const { zarahNft, nftGatedEvent } = await loadFixture(deployNftGatedEventFixture);

      expect(await nftGatedEvent.eventNft()).to.equal(zarahNft.target);
    });

    it("Should set the right NFT", async function () {
      const { zarahNft, nftGatedEvent } = await loadFixture(deployNftGatedEventFixture);
      
      const nft = await nftGatedEvent.eventNft();

      expect(nft).to.equal(zarahNft.target);
    });

    it("Should create event and add it to the array", async function () {
      const { zarahNft, nftGatedEvent, owner, otherAccount } = await loadFixture(
        deployNftGatedEventFixture
      );


      const title = "Form";
      const desc = "mtokee wote";
      const venue = "we kam tu";
      const date = "kwani ni kesho";

      const tx = await nftGatedEvent.createEvent(title, desc, venue, date);
      await tx.wait();
      

      expect(await nftGatedEvent.eventCount()).to.equal(1);
      expect(await nftGatedEvent.getAllEvents()).to.have.lengthOf(1);


      const createdEvent = await nftGatedEvent.viewEvent(1);

      expect(createdEvent.eventTitle).to.equal(title);
      expect(createdEvent.description).to.equal(desc);
      expect(createdEvent.venue).to.equal(venue);
      expect(createdEvent.eventDate).to.equal(date);    

    });

    it("Should allow users to register for event", async function () {
      const { zarahNft, nftGatedEvent, owner, otherAccount } = await loadFixture(
        deployNftGatedEventFixture
      );
      

      await expect(nftGatedEvent.connect(owner).registerForEvent(1)).to.be.rejectedWith("not elligible for event");
      const title = "Web3 Lagos Conference";
      const desc = "This is the best Web3 event in Lagos";
      const venue = "The Zone Gbagada Lagos";
      const eventDate = "18th Oct 2024";

      const tx = await nftGatedEvent.createEvent(title, desc, venue, eventDate);
      await tx.wait();

      const mintTx = await zarahNft.safeMint(otherAccount.address, 1);
      await mintTx.wait();

      const regTx = await nftGatedEvent.connect(otherAccount).registerForEvent(1);
      await regTx.wait();

      expect(await nftGatedEvent.checkRegistrationValidity(1, otherAccount.address)).to.be.equal(true);

      const createdEvent = await nftGatedEvent.viewEvent(1);

      expect(createdEvent.registeredUsers.length).to.be.eq(1);





   
      
    });
  // });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  });
});
