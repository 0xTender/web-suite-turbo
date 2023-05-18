import { ComplaintStatus, complaint_statuses } from "./types";

type Permissions = Record<ComplaintStatus, ComplaintStatus[]>;

export const initial_permissions: Permissions = {
  Registered: ["InProgress", "Rejected"],
  InProgress: [
    "InProgress",
    "StatusUpdate",
    "Resolved",
    "ClosedAfterRejection",
    "ClosedAfterResolution",
  ],
  StatusUpdate: [
    "StatusUpdate",
    "Resolved",
    "ClosedAfterRejection",
    "ClosedAfterResolution",
  ],
  Resolved: [],
  Rejected: ["ReOpened"],
  ClosedAfterResolution: [],
  ClosedAfterRejection: [],
  ReOpened: ["InProgress"],
};

export const get_status_index = (status: ComplaintStatus): number => {
  return complaint_statuses.indexOf(status);
};
