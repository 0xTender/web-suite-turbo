// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ComplaintRegistry is Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _complaint_ids;

  struct UserProfile {
    string user_hash;
  }

  enum Roles {
    None,
    Admin,
    Handler,
    User
  }

  mapping(address => Roles) public roles;

  event RoleUpdated(address indexed user, Roles role, bool is_active);

  function has_role(address user, Roles role) public view returns (bool) {
    return roles[user] == role;
  }

  modifier only_with_role(Roles role) {
    require(
      has_role(_msgSender(), role),
      "ComplaintRegistry: Only admin can call this function"
    );
    _;
  }

  mapping(address => UserProfile) public user_profiles;

  event UserProfileCreated(address indexed user, UserProfile profile);

  enum ComplaintStatus {
    Registered,
    InProgress,
    StatusUpdate,
    Resolved,
    Rejected,
    ClosedAfterResolution,
    ClosedAfterRejection,
    ReOpened
  }

  struct ComplaintState {
    ComplaintStatus status;
    // for registered this defaults to address(0)
    address handler;
    string hashed_data;
  }

  struct Complaint {
    ComplaintState[] states;
  }
  event ComplaintStateUpdated(
    Complaint complaint,
    uint256 complaint_id,
    address updated_by
  );

  mapping(uint256 => Complaint) private _complaints;

  function get_complaint(
    uint256 complaint_id
  ) external view returns (Complaint memory) {
    return _complaints[complaint_id];
  }

  function get_complaint_states(
    uint256 complaint_index
  ) external view returns (ComplaintState[] memory) {
    return _complaints[complaint_index].states;
  }

  function update_admin(address admin, bool enabled) external onlyOwner {
    require(owner() != admin, "Owner is always an admin");

    if (enabled) {
      roles[admin] = Roles.Admin;
    } else {
      roles[admin] = Roles.None;
    }

    emit RoleUpdated(admin, Roles.Admin, enabled);
  }

  function update_handler(
    address handler,
    bool enabled
  ) external only_with_role(Roles.Admin) {
    require(owner() != handler, "Owner cannot be a handler");
    if (enabled) {
      roles[handler] = Roles.Handler;
    } else {
      roles[handler] = Roles.None;
    }
    emit RoleUpdated(handler, Roles.Handler, enabled);
  }

  function create_profile(UserProfile memory profile) external {
    require(bytes(profile.user_hash).length > 0, "User Profile is required");

    require(roles[_msgSender()] == Roles.None, "User already has a profile");

    user_profiles[_msgSender()] = profile;
    roles[_msgSender()] = Roles.User;
    emit UserProfileCreated(_msgSender(), profile);
    emit RoleUpdated(_msgSender(), Roles.User, true);
  }

  function register_complaint(string memory hashed_data) public {
    require(
      roles[_msgSender()] != Roles.None,
      "ComplaintRegistry: User does not have a profile"
    );

    _complaint_ids.increment();

    uint256 complaint_id = _complaint_ids.current();

    Complaint storage complaint = _complaints[complaint_id];

    complaint.states.push(
      ComplaintState({
        status: ComplaintStatus.Registered,
        handler: _msgSender(),
        hashed_data: hashed_data
      })
    );

    emit ComplaintStateUpdated(
      _complaints[complaint_id],
      complaint_id,
      _msgSender()
    );
  }

  mapping(ComplaintStatus => ComplaintStatus[]) public allowed_statuses;

  event AllowedStatesUpdated(
    ComplaintStatus status,
    ComplaintStatus[] allowed_states
  );

  function get_allowed_statuses(
    ComplaintStatus status
  ) external view returns (ComplaintStatus[] memory) {
    return allowed_statuses[status];
  }

  function update_allowed_statuses(
    ComplaintStatus status,
    ComplaintStatus[] memory allowed_status_arr
  ) external only_with_role(Roles.Admin) {
    allowed_statuses[status] = allowed_status_arr;
    emit AllowedStatesUpdated(status, allowed_status_arr);
  }

  function get_current_state_index(
    uint256 complaint_id
  ) public view returns (uint256) {
    Complaint memory complaint = _complaints[complaint_id];
    return complaint.states.length - 1;
  }

  function is_allowed_status(
    uint256 complaint_id,
    ComplaintStatus allowed_status
  ) public view returns (bool) {
    uint256 current_index = get_current_state_index(complaint_id);

    ComplaintStatus status = _complaints[complaint_id]
      .states[current_index]
      .status;

    ComplaintStatus[] memory _allowed_status = allowed_statuses[status];
    for (uint256 i = 0; i < _allowed_status.length; i++) {
      if (_allowed_status[i] == allowed_status) {
        return true;
      }
    }
    return false;
  }

  function reopen_complaint(
    uint256 complaint_id,
    ComplaintState memory state
  ) external {
    address sender = _msgSender();
    require(has_role(sender, Roles.None) != true, "User not registered");
    require(
      _complaints[complaint_id].states[0].handler == sender,
      "Invalid user. Cannot reopen."
    );

    require(
      state.handler == sender,
      "Only the initial can have new reopen the complaint"
    );

    require(
      is_allowed_status(complaint_id, state.status),
      "Invalid complaint status"
    );

    Complaint storage complaint = _complaints[complaint_id];
    complaint.states.push(state);
    emit ComplaintStateUpdated(complaint, complaint_id, sender);
  }

  function update_complaint_state(
    uint256 complaint_id,
    ComplaintState memory state
  ) external {
    address sender = _msgSender();
    require(has_role(sender, Roles.None) != true, "User not registered");
    require(
      has_role(sender, Roles.Admin) || has_role(sender, Roles.Handler) == true,
      "User does not have permission to update complaint state"
    );
    require(
      is_allowed_status(complaint_id, state.status),
      "Invalid complaint status"
    );

    require(
      has_role(state.handler, Roles.Admin) ||
        has_role(state.handler, Roles.Handler),
      "In-Sufficient role to handle complaint"
    );

    Complaint storage complaint = _complaints[complaint_id];

    complaint.states.push(state);
    emit ComplaintStateUpdated(complaint, complaint_id, sender);
  }

  constructor() {
    address admin = owner();
    roles[admin] = Roles.Admin;
    emit RoleUpdated(admin, Roles.Admin, true);
  }
}
