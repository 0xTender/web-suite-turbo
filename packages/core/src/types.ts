export const complaint_statuses = [
  "Registered",
  "InProgress",
  "StatusUpdate",
  "Resolved",
  "Rejected",
  "ClosedAfterResolution",
  "ClosedAfterRejection",
  "ReOpened",
] as const;

export type ComplaintStatus = (typeof complaint_statuses)[number];

export enum Roles {
  None,
  Admin,
  Handler,
  User,
}
