import { MigrationEventTypes } from "@0xtender/evm-helpers";
import { user_profile_created } from "./events/user_profile_created";
import { role_updated } from "./events/role_updated";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function store_event_data(
  data: MigrationEventTypes["event_data"]
) {
  for (let index = 0; index < data.length; index++) {
    const events = data[index];
    for (let index = 0; index < events.length; index++) {
      try {
        const event = events[index];
        await user_profile_created(event);
        await role_updated(event);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

const data = async () => {
  return [
    await import("./events/user_profile_created"),
    await import("./events/role_updated"),
  ];
};

export async function initial_run() {
  const runs = await data();
  for (let index = 0; index < runs.length; index++) {
    const is_created = await prisma.listener.findFirst({
      where: {
        function_name: runs[index].function_name,
      },
    });
    if (!is_created) {
      console.log(`[LOG]: Running ${runs[index].function_name}`);
      await runs[index].default();
      await prisma.listener.create({
        data: {
          function_name: runs[index].function_name,
        },
      });
    }
  }
}
