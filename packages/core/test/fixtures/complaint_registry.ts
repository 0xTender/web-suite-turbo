import { deployments, getNamedAccounts, getUnnamedAccounts } from "hardhat";
import { ComplaintRegistry } from "../../typechain-types";
import { setupUser, setupUsers } from "./utils";

export const complaint_registry_fixture = deployments.createFixture(
  async (hre) => {
    await hre.deployments.fixture(["ComplaintRegistry"]);

    const { deployer, admin } = await getNamedAccounts();

    const ComplaintRegistry = await hre.ethers.getContract<ComplaintRegistry>(
      "ComplaintRegistry"
    );

    const users = await getUnnamedAccounts();

    const contracts = { ComplaintRegistry };

    return {
      ...contracts,
      admin: await setupUser(admin, contracts),
      deployer: await setupUser(deployer, contracts),
      users: await setupUsers(users, contracts),
    };
  }
);
