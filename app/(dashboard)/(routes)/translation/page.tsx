"use client";

import * as z from "zod";
import { Languages, Mic, Pause, X } from "lucide-react";
import { set, useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import Heading from "@/components/heading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { use, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import useAutosizeTextArea from "@/lib/useAutoSizeTextArea";
import { useReactMediaRecorder } from "react-media-recorder-2";

const Dashboard = () => {
  const router = useRouter();
  const { toast } = useToast();
  const tqAutoSizeRef = useRef<HTMLTextAreaElement>(null);
  const arAutoSizeRef = useRef<HTMLTextAreaElement>(null);
  const [arabic, setArabic] = useState<any>("");
  const [tamasheq, setTamasheq] = useState<any>("");
  const [isRecording, setIsRecording] = useState<Boolean>(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      arText: "",
      tqText: "",
    },
  });

  let isLoading = form.formState.isSubmitting;
  let recorded = useRef<Uint8Array | null>(null);

  useAutosizeTextArea(tqAutoSizeRef.current, tamasheq);
  useAutosizeTextArea(arAutoSizeRef.current, arabic);

  useEffect(() => {
    if (!mediaBlobUrl) return;
    (async () => {
      const response = await fetch(mediaBlobUrl!);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      recorded.current = new Uint8Array(arrayBuffer);
    })();
  }, [mediaBlobUrl]);

  console.log(tamasheq);
  console.log(arabic);

  const onSubmit = async () => {
    const data = tamasheq;

    try {
      if (data?.length < 2 || !data) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "No Text, please try again",
        });
      } else {
        const response = await axios.post(
          "https://api-inference.huggingface.co/models/ad019el/m2m100_418M-finetuned-tq-to-ar",
          data,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          }
        );
        const result = await response.data[0].generated_text;
        setArabic(result);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "The model is currently loading, please try again after a few seconds.",
      });
    } finally {
      router.refresh();
    }
  };

  const transcribeAudioTamasheq = async () => {
    try {
      const data = await recorded.current;

      if (data?.length === 0 || !data) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "No audio selected, please try again",
        });
      } else {
        const response = await axios.post(
          "https://api-inference.huggingface.co/models/ad019el/tamasheq-99-final",
          data,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          }
        );

        const result = await response.data.text;
        setTamasheq(result);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "The model is currently loading, please try again after a few seconds.",
      });
    } finally {
      router.refresh();
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
      transcribeAudioTamasheq();
    } else {
      startRecording();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div>
      <Heading
        title="Translate"
        description="Translate tamasheq to arabic, french and english"
        icon={Languages}
        iconColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 content-center"
            >
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="tqText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamasheq</FormLabel>
                      <FormControl>
                        {/* // Todo: add auto resize textarea | microphone */}
                        <div className="relative">
                          <Textarea
                            className="text-lg text-right h-32 pl-8 overflow-hidden resize-none"
                            dir="rtl"
                            disabled={isLoading}
                            placeholder=""
                            {...field}
                            ref={tqAutoSizeRef}
                            value={tamasheq}
                            onChange={(e) => setTamasheq(e.target.value)}
                          />
                          <X
                            className={cn(
                              "text-black/80 absolute top-3 left-2 cursor-pointer",
                              tamasheq.length === 0 && "hidden",
                              isLoading && "cursor-not-allowed"
                            )}
                            onClick={() => {
                              if (!isLoading) {
                                setTamasheq("");
                                tqAutoSizeRef.current!.style.height = "128px";
                              }
                            }}
                          />
                          <p
                            className={cn(
                              "absolute bottom-2 right-2 text-sm text-muted-foreground",
                              tamasheq.length > 500 && "text-red-500"
                            )}
                          >
                            {tamasheq.length}/500
                          </p>
                          <button
                            className={cn(
                              "absolute bottom-2 left-2 w-5",
                              status == "recording" && "animate-pulse"
                            )}
                            type="button"
                            disabled={isLoading /* || !isModelLoaded */}
                            onClick={handleToggleRecording}
                          >
                            {status == "recording" ? (
                              <Pause className="text-red-500" />
                            ) : (
                              <Mic className="text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="arText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arabic</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            dir="rtl"
                            disabled={isLoading}
                            placeholder=""
                            className="text-lg text-right h-32 pl-8 overflow-hidden resize-none"
                            {...field}
                            ref={arAutoSizeRef}
                            value={arabic}
                            onChange={(e) => setArabic(e.target.value)}
                          />
                          <X
                            className={cn(
                              "text-black/80 absolute top-3 left-2 cursor-pointer",
                              arabic.length === 0 && "hidden",
                              isLoading && "cursor-not-allowed"
                            )}
                            onClick={() => {
                              if (!isLoading) {
                                setArabic("");
                                arAutoSizeRef.current!.style.height = "128px";
                              }
                            }}
                          />
                          <p
                            className={cn(
                              "absolute bottom-2 right-2 text-sm text-muted-foreground",
                              arabic.length > 500 && "text-red-500"
                            )}
                          >
                            {arabic.length}/500
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="col-span-12 lg:col-span-2 mx-auto w-full flex space-x-2"
                type="submit"
              >
                Translate
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
