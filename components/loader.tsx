import Image from "next/image";

export const Loader = () => {
  return (
    <div className="flex flex-col h-full gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-pulse">
        <Image alt="logo" fill src="/logo_black.png" />
      </div>
      <p className="text-sm text-muted-foreground">
        TamaLinguist is thinking...
      </p>
    </div>
  );
};
