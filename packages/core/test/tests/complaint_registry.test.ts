import { complaint_registry_fixture } from "../fixtures/complaint_registry";
import { PromiseType } from "../fixtures/utils";
import { expect } from "chai";
import {
  get_status_index,
  initial_permissions,
} from "../../src/initial_permissions";
import { ComplaintStatus, Roles } from "../../src/types";

describe("ComplaintRegistry", () => {
  type Fixture = PromiseType<ReturnType<typeof complaint_registry_fixture>>;
  type UserType = Fixture["deployer"];

  let deployer: UserType;
  let admin_user: UserType;
  let alice: UserType;
  let bob: UserType;
  let ComplaintRegistry: UserType["ComplaintRegistry"];

  beforeEach(async () => {
    ({
      deployer,
      admin: admin_user,
      users: [alice, bob],
      ComplaintRegistry,
    } = await complaint_registry_fixture());
  });

  describe("Deployment Tests", async () => {
    it("Owner and Admin", async () => {
      expect(await ComplaintRegistry.owner()).to.eq(deployer.address);
      expect(await ComplaintRegistry.roles(deployer.address)).to.eq(
        Roles.Admin
      );
    });

    it("Initial permissions", async () => {
      for (const permission in initial_permissions) {
        const status = get_status_index(permission as ComplaintStatus);
        const allowed_status_array =
          initial_permissions[permission].map(get_status_index);

        const current_status_array =
          await ComplaintRegistry.get_allowed_statuses(status);

        expect(current_status_array).to.deep.eq(allowed_status_array);
      }
    });
  });

  describe("Governance", async () => {
    it("owner should be able to create and remove admin", async () => {
      await expect(ComplaintRegistry.update_admin(admin_user.address, true))
        .to.emit(ComplaintRegistry, "RoleUpdated")
        .withArgs(admin_user.address, Roles.Admin, true);

      expect(await ComplaintRegistry.roles(admin_user.address)).to.eq(
        Roles.Admin
      );
      expect(
        await ComplaintRegistry.has_role(admin_user.address, Roles.Admin)
      ).to.eq(true);

      await expect(ComplaintRegistry.update_admin(admin_user.address, false))
        .to.emit(ComplaintRegistry, "RoleUpdated")
        .withArgs(admin_user.address, Roles.Admin, false);

      expect(await ComplaintRegistry.roles(admin_user.address)).to.eq(
        Roles.None
      );
      expect(
        await ComplaintRegistry.has_role(admin_user.address, Roles.Admin)
      ).to.eq(false);
    });

    it("owner should be able to create and remove handler", async () => {
      await expect(ComplaintRegistry.update_handler(alice.address, true))
        .to.emit(ComplaintRegistry, "RoleUpdated")
        .withArgs(alice.address, Roles.Handler, true);

      expect(await ComplaintRegistry.roles(alice.address)).to.eq(Roles.Handler);

      await expect(ComplaintRegistry.update_handler(alice.address, false))
        .to.emit(ComplaintRegistry, "RoleUpdated")
        .withArgs(alice.address, Roles.Handler, false);

      expect(await ComplaintRegistry.roles(alice.address)).to.eq(Roles.None);
    });

    it("admin should be able to create and remove handler", async () => {
      await ComplaintRegistry.update_admin(admin_user.address, true);

      await expect(
        admin_user.ComplaintRegistry.update_handler(alice.address, true)
      )
        .to.emit(ComplaintRegistry, "RoleUpdated")
        .withArgs(alice.address, Roles.Handler, true);
    });
  });

  describe("User Profiles", () => {
    it("no empty profile", async () => {
      const profile = {
        user_hash: "",
      };
      await expect(
        ComplaintRegistry.create_profile(profile)
      ).to.be.revertedWith("User Profile is required");
    });

    it("user can create profile", async () => {
      const profile = {
        user_hash: alice.address.toString(),
      };
      const ComplaintRegistry = alice.ComplaintRegistry;
      await expect(ComplaintRegistry.create_profile(profile)).to.emit(
        ComplaintRegistry,
        "UserProfileCreated"
      );

      // cannot recreate profile
      await expect(
        ComplaintRegistry.create_profile(profile)
      ).to.be.revertedWith("User already has a profile");
    });
  });

  describe("Complaints", () => {
    beforeEach(async () => {
      const profile = {
        user_hash: alice.address.toString(),
      };
      await alice.ComplaintRegistry.create_profile(profile);

      // admin_user is handler
      await ComplaintRegistry.update_handler(admin_user.address, true);
    });

    const hashed_data = `hashed_data`;

    it("register complaint", async () => {
      const tx = await alice.ComplaintRegistry.register_complaint(hashed_data);
      const receipt = await tx.wait();
      const event = receipt.events?.find(
        (e) => e.event === "ComplaintStateUpdated"
      );
      expect(event?.args).to.not.be.undefined;
      if (event?.args) {
        const { complaint, complaint_id } = event.args;

        expect(complaint_id).to.eq(1);

        const { states } = complaint;
        const { status, handler, hashed_data } = states[0];

        expect(status).to.eq(0);
        expect(handler).to.eq(alice.address);
        expect(hashed_data).to.eq(hashed_data);
      }
    });

    it("reopen complaint", async () => {
      await alice.ComplaintRegistry.register_complaint(hashed_data);

      await admin_user.ComplaintRegistry.update_complaint_state(1, {
        handler: admin_user.address,
        status: get_status_index("Rejected"),
        hashed_data: hashed_data,
      });

      await expect(
        admin_user.ComplaintRegistry.reopen_complaint(1, {
          handler: alice.address,
          status: get_status_index("ReOpened"),
          hashed_data: hashed_data,
        })
      ).to.be.revertedWith("Invalid user. Cannot reopen.");

      await expect(
        alice.ComplaintRegistry.reopen_complaint(1, {
          handler: admin_user.address,
          status: get_status_index("ReOpened"),
          hashed_data: hashed_data,
        })
      ).to.be.revertedWith(
        "Only the initial can have new reopen the complaint"
      );

      await alice.ComplaintRegistry.reopen_complaint(1, {
        handler: alice.address,
        status: get_status_index("ReOpened"),
        hashed_data: hashed_data,
      });
    });

    it("move complaint state", async () => {
      await alice.ComplaintRegistry.register_complaint(hashed_data);

      await expect(
        admin_user.ComplaintRegistry.update_complaint_state(1, {
          handler: alice.address,
          status: get_status_index("StatusUpdate"),
          hashed_data: hashed_data,
        })
      ).to.be.revertedWith("Invalid complaint status");

      await admin_user.ComplaintRegistry.update_complaint_state(1, {
        handler: admin_user.address,
        status: get_status_index("InProgress"),
        hashed_data: hashed_data,
      });

      await expect(
        alice.ComplaintRegistry.update_complaint_state(1, {
          handler: admin_user.address,
          status: get_status_index("StatusUpdate"),
          hashed_data: hashed_data,
        })
      ).to.be.revertedWith(
        "User does not have permission to update complaint state"
      );

      await admin_user.ComplaintRegistry.update_complaint_state(1, {
        handler: admin_user.address,
        status: get_status_index("StatusUpdate"),
        hashed_data: hashed_data,
      });

      await expect(
        admin_user.ComplaintRegistry.update_complaint_state(1, {
          handler: alice.address,
          status: get_status_index("StatusUpdate"),
          hashed_data: hashed_data,
        })
      ).to.be.revertedWith("In-Sufficient role to handle complaint");
    });
  });
});
