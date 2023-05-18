import { createTRPCRouter, public_procedure } from "@app/server/api/trpc";
import { readFileSync } from "fs";

import { z } from "zod";

export const contractRouter = createTRPCRouter({
  get_contract: public_procedure
    .input(
      z.object({
        contract_name: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const contract = await ctx.prisma.contract_pm.findFirstOrThrow({
        where: {
          name: input.contract_name,
        },
      });

      return {
        ...contract,
        abi: JSON.parse(readFileSync(contract.abiPath).toString()).abi,
        abiPath: undefined,
      };
    }),
});
