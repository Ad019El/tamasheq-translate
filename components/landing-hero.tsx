"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5  flex-row items-center justify-center">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>TamaLinguist</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-600 pl-10">
          <TypewriterComponent
            options={{
              strings: [
                "Transcribe",
                "Translate",
                // "Translate to Arabic",
                // "Translate to French",
                // "Translate to English",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-400">
        Translate and Transcribe Tamasheq
      </div>
      <div className={cn(isSignedIn && "hidden")}>
        <Link href={isSignedIn ? "/transcription" : "/sign-up"}>
          <Button
            variant="default"
            className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
          >
            Sign up now
          </Button>
        </Link>
      </div>
    </div>
  );
};
