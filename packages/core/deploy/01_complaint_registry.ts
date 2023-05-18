import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ComplaintRegistry } from "../typechain-types";
import { ethers } from "hardhat";
import {
  get_status_index,
  initial_permissions,
} from "../src/initial_permissions";
import { ComplaintStatus } from "../src/types";

const deploy_function: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const is_hardhat = hre.network.name === "hardhat";

  await deploy("ComplaintRegistry", {
    contract: "ComplaintRegistry",
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: true,
  });
  const signer = await ethers.getSigner(deployer);

  const ComplaintRegistry = (
    await ethers.getContract<ComplaintRegistry>("ComplaintRegistry")
  ).connect(signer);

  for (const permission in initial_permissions) {
    const status = get_status_index(permission as ComplaintStatus);
    const allowed_status_array =
      initial_permissions[permission].map(get_status_index);

    const current_status_array = await ComplaintRegistry.get_allowed_statuses(
      status
    );

    if (!current_status_array.every((v, i) => v === allowed_status_array[i])) {
      continue;
    }

    const tx = await ComplaintRegistry.update_allowed_statuses(
      status,
      allowed_status_array
    );
    if (!is_hardhat) {
      console.log(`tx: ${tx.hash} for `, permission);
    }
    await tx.wait();
  }
};

export default deploy_function;

deploy_function.tags = ["ComplaintRegistry"];
