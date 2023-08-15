"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Languages, PenLine } from "lucide-react";

const monserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    lable: "Transcribe",
    icon: PenLine,
    href: "/transcription",
    color: "text-sky-500",
  },
  {
    lable: "Translate",
    icon: Languages,
    href: "/translation",
    color: "text-blue-500",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/transcription" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Image fill src="/logo.png" alt="LOGO" />
          </div>
          <h1 className={cn("text-2xl font-bold", monserrat.className)}>
            TamaLinguist
          </h1>
        </Link>
        <div className="space-y-">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex my-1 p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                route.href === pathname
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.lable}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
