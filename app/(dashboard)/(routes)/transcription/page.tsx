"use client";

import * as z from "zod";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { Mic, Pause, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useReactMediaRecorder } from "react-media-recorder-2";
import { cn, convertArabicToLatin } from "@/lib/utils";

import Heading from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { useToast } from "@/components/ui/use-toast";
import { Empty } from "@/components/empty";

const Dashboard = () => {
  const router = useRouter();
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [transciption, setTranscription] = useState<String>("");
  const [audioType, setAudioType] = useState<String>("");
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<Boolean>(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  const { toast } = useToast();

  let recorded = useRef<Uint8Array | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audioFile: null,
    },
  });

  async function loadModel() {
    return await axios.post(
      "https://api-inference.huggingface.co/models/ad019el/tamasheq-99-2",
      { data: "asdf" },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      }
    );
  }

  useEffect(() => {
    (async () => {
      if (isModelLoaded) return;
      await loadModel()
        .catch((res) => {
          if (res.response.status === 503) {
            setIsModelLoaded(false);
          } else if (res.response.status !== 503) {
            setIsModelLoaded(true);
          }
          // console.log("model loaded", res.response.status);
        })
        .then(() => {
          !isModelLoaded
            ? setTimeout(() => {
                toast({
                  variant: "default",
                  title: "Yaay!",
                  description: "Model is ready",
                });
                setIsModelLoaded(true);
              }, 4000)
            : toast({
                variant: "default",
                title: "Yaay!",
                description: "Model is ready",
              });
        });
    })();
  }, [isModelLoaded, toast]);

  useEffect(() => {
    if (!mediaBlobUrl) return;
    (async () => {
      const response = await fetch(mediaBlobUrl!);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      recorded.current = new Uint8Array(arrayBuffer);
    })();
  }, [mediaBlobUrl]);

  let isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
      const data = audioData || recorded.current;

      if (data?.length === 0 || !data) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "No audio selected, please try again",
        });
      } else {
        const response = await axios.post(
          "https://api-inference.huggingface.co/models/ad019el/tamasheq-99-2",
          data,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          }
        );

        const result = await response.data.text;
        setTranscription(result);

        form.reset();
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setAudioType("");
    if (file) {
      const reader = new FileReader();
      setAudioData(null);
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          const arrayBuffer = new Uint8Array(reader.result);
          setAudioData(arrayBuffer);
          setAudioType(file?.name!);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setAudioType("");
      stopRecording();
      const date = new Date();
      const showTime =
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      setAudioType(showTime);
    } else {
      startRecording();
      setAudioData(null);
    }
    setIsRecording(!isRecording);
  };

  return (
    <div>
      <Heading
        title="Transcribe"
        description="Transcribe tamasheq to arabic alphabet"
        icon={PenLine}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />
      <br />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <div className="col-span-12 max-w-xl lg:col-span-10">
                <Input
                  disabled={isLoading || !isModelLoaded}
                  id="audioFile"
                  type="file"
                  accept="audio/*"
                  alt="sdfg"
                  onChange={handleFileChange}
                />
              </div>

              <div className="col-span-12 lg:col-span-2 w-full flex space-x-2">
                <Button
                  className="flex-1"
                  type="submit"
                  disabled={isLoading || !isModelLoaded}
                >
                  Transcribe
                </Button>
                <Button
                  variant={status == "recording" ? "destructive" : "default"}
                  className={cn(
                    "w-14",
                    status == "recording" && "animate-pulse"
                  )}
                  type="button"
                  disabled={isLoading || !isModelLoaded}
                  onClick={handleToggleRecording}
                >
                  {status == "recording" ? <Pause /> : <Mic />}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <br />

        {audioData && (
          <div>
            <p className="text-sm p-1 text-muted-foreground">{audioType}</p>
            <audio controls className="w-full">
              <source
                src={URL.createObjectURL(
                  new Blob([audioData], { type: "audio/wav" })
                )}
              />
            </audio>
          </div>
        )}

        {mediaBlobUrl && !audioData && (
          <div>
            <p className="text-sm p-1 text-muted-foreground">
              Audio recorded from browser [{audioType}]
            </p>
            <audio controls className="w-full" src={mediaBlobUrl} />
          </div>
        )}

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
        </div>

        {transciption.length === 0 && !isLoading && (
          <Empty lable="No audio transcribed." />
        )}

        <div
          dir="rtl"
          className={cn(
            "rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm mt-4 bg-muted text-xl text-right",
            !transciption && "hidden"
          )}
        >
          {transciption}
        </div>
        <div
          className={cn(
            "rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm mt-4 bg-muted text-xl text-left",
            !transciption && "hidden"
          )}
        >
          {convertArabicToLatin(transciption)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
