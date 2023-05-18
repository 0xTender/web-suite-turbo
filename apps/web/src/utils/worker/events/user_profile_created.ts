import { EventSearchKey } from "@app/utils/types";
import {
  E_UserProfileCreated_ComplaintRegistry,
  PrismaClient,
} from "@prisma/client";
import { log_custom_error } from "../log_error";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const event_name = "e_UserProfileCreated_ComplaintRegistry";

const index_model_name = "user";

export const function_name = "user_profile_created";

async function index_event(
  fetched_event: E_UserProfileCreated_ComplaintRegistry | null
) {
  if (fetched_event) {
    await prisma[index_model_name].update({
      where: {
        wallet_address: fetched_event.A_user,
      },
      data: {
        verified: true,
      },
    });
  } else {
    console.warn(`User profile is not real.`);
    await log_custom_error({
      function_name,
      error: JSON.stringify({
        message: "User profile is not real",
        fetched_event,
        index_model_name,
        event_name,
      }),
    });
  }
}

export default async function run_indexer() {
  const events = await prisma[event_name].findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  for (let index = 0; index < events.length; index++) {
    const fetched_event = events[index];
    try {
      await index_event(fetched_event);
    } catch (err) {
      const error_id = randomUUID();
      console.error(err, error_id);

      await log_custom_error({
        function_name,
        error: JSON.stringify({
          message: "User profile is not real",
          fetched_event,
          index_model_name,
          event_name,
        }),
      });
    }
  }
}

export async function user_profile_created(event: EventSearchKey) {
  if (event.event_changed_name !== event_name) return;

  const fetched_event = await prisma[event_name].findFirst({
    where: {
      eventId: event.id,
    },
  });

  console.log("[LOG]: received", fetched_event, event_name);
  try {
    await index_event(fetched_event);
  } catch (err) {
    const error_id = randomUUID();
    console.error(err, error_id);

    await log_custom_error({
      function_name,
      error: JSON.stringify({
        message: "User profile is not real",
        fetched_event,
        index_model_name,
        event_name,
      }),
    });
  }
}
