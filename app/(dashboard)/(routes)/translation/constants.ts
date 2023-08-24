import * as z from "zod";

export const formSchema = z.object({
  // audioFile: z.string().min(1, { message: "Prompt is required" }),
  arText: z.string(),
  tqText: z.string(),
});
