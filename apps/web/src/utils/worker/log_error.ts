import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const log_custom_error = async ({
  function_name,
  error,
}: {
  function_name: string;
  error: string;
}) => {
  await prisma.listenerError.create({
    data: {
      function_name,
      error,
    },
  });
};
