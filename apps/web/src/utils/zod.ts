import { z } from "zod";
export const complaint_schema = z.object({
  title: z.string(),
  description: z.string(),
  affected: z.string().optional(),
  concerned_department: z.string().optional(),
  source_of_complaint: z.string().optional(),
});
