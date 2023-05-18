import { EventSearchKey } from "@app/utils/types";
import { E_RoleUpdated_ComplaintRegistry, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { log_custom_error } from "../log_error";

const prisma = new PrismaClient();

const event_name = "e_RoleUpdated_ComplaintRegistry";

const index_model_name = "role";
export const function_name = "role_updated";

async function index_event(
  fetched_event: E_RoleUpdated_ComplaintRegistry | null
) {
  if (fetched_event) {
    await prisma[index_model_name].upsert({
      create: {
        role: fetched_event.A_role,
        wallet_address: fetched_event.A_user,
        event_pmId: fetched_event.eventId,
      },
      update: {
        role: fetched_event.A_role,
        event_pmId: fetched_event.eventId,
      },
      where: {
        wallet_address: fetched_event.A_user,
      },
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
          message: "Role update failed",
          fetched_event,
          index_model_name,
          event_name,
        }),
      });
    }
  }
}

export async function role_updated(event: EventSearchKey) {
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
        message: "Role update failed",
        fetched_event,
        index_model_name,
        event_name,
      }),
    });
  }
}
