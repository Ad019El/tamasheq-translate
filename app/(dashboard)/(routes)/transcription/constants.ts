import * as z from "zod";

const ACCEPTED_AUDIO_TYPES = [
  "audio/wav",
  "audio/mp3",
  "audio/mpeg",
  "audio/ogg",
];
const MAX_FILE_SIZE = 500000;

export const formSchema = z.object({
  // audioFile: z.string().min(1, { message: "Prompt is required" }),
  audioFile: z.any(),
  // .refine(
  //   (files) => files?.[0]?.size <= MAX_FILE_SIZE,
  //   `Max file size is 5MB.`
  // )
  // .refine(
  //   (files) => ACCEPTED_AUDIO_TYPES.includes(files?.type),
  //   ".wav, .mp3, .mpeg and .ogg files are accepted."
  // ),
});
