import { z } from "zod";

import { createTRPCRouter, public_procedure } from "@app/server/api/trpc";
import { ethers } from "ethers";
import { TRPCError } from "@trpc/server";
import { sign } from "jsonwebtoken";
import { env } from "@app/env.mjs";

const base_schema = {
  first_name: z.string(),
  last_name: z.string(),
  address: z.string(),
  phone_number: z.coerce.number(),
  email: z.string().email(),
};

export const userRouter = createTRPCRouter({
  authenticate: public_procedure
    .input(
      z.object({
        hash_string: z.string(),
        address: z.string(),
        sign: z.string(),
      })
    )
    .mutation(({ input }) => {
      const data = input.hash_string;
      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));
      const hashBuffer = ethers.utils.arrayify(hash);

      const signer = ethers.utils.verifyMessage(hashBuffer, input.sign);
      if (signer !== input.address) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid signature",
        });
      }

      return sign({ address: input.address }, env.JWT_SECRET, {
        expiresIn: "1h",
      });
    }),
  getProfile: public_procedure
    .input(z.string().optional())
    .query(({ input, ctx }) => {
      if (!input) {
        return null;
      }
      return ctx.prisma.user.findUnique({
        where: {
          wallet_address: input,
        },
      });
    }),
  createProfile: public_procedure
    .input(
      z.object({
        formState: z.object(base_schema),
        address: z.string(),
        sign: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { formState } = input;

      const data = JSON.stringify(formState);
      const hash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(JSON.stringify(data))
      );
      const hashBuffer = ethers.utils.arrayify(hash);

      const signer = ethers.utils.verifyMessage(hashBuffer, input.sign);
      if (signer !== input.address) {
        throw new Error("Invalid signature");
      }

      return ctx.prisma.user.create({
        data: {
          ...formState,
          wallet_address: input.address,
          phone_number: formState.phone_number.toString(),
        },
      });
    }),
});
