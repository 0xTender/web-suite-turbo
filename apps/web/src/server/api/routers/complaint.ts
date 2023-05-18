import {
  authenticated_procedure,
  createTRPCRouter,
} from "@app/server/api/trpc";
import { get_storage_location } from "@app/utils";
import { randomUUID } from "crypto";
import { writeFileSync } from "fs";
import { join } from "path";
import { z } from "zod";
import { complaint_schema } from "@app/utils/zod";

const file_version = 1;

export const complaint_router = createTRPCRouter({
  store_file: authenticated_procedure
    .input(
      z.object({
        version: z.undefined().optional(),
        complaint: complaint_schema,
      })
    )
    .mutation(({ input }) => {
      const file_hash = randomUUID();
      const storage_path = join(get_storage_location(), file_hash) + ".json";
      console.log(storage_path);
      writeFileSync(storage_path, JSON.stringify({ file_version, ...input }));
      return storage_path;
    }),
});
