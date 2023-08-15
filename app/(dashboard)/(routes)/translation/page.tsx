import Heading from "@/components/heading";
import { Languages } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      {" "}
      <Heading
        title="Translate"
        description="Translate tamasheq to arabic, french and english"
        icon={Languages}
        iconColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
    </div>
  );
};

export default Dashboard;
