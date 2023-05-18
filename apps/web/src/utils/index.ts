import { join } from "path";

export function get_storage_location() {
  return join(__dirname, "..", "..", "..", "..", "..", "storage");
}
