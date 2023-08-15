import Heading from "@/components/heading";
import { PenLine } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      {" "}
      <Heading
        title="Transcribe"
        description="Transcribe tamasheq to arabic alphabet"
        icon={PenLine}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />
    </div>
  );
};

export default Dashboard;
