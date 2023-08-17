import Image from "next/image";

interface EmptyProps {
  lable: string;
}

export const Empty = ({ lable }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image alt="Empty" fill src="/empty.png" />
      </div>
      <p className="test-sm text-muted-foreground text-center">{lable}</p>
    </div>
  );
};
