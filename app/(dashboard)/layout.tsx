import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
        <Toaster />
      </main>
    </div>
  );
};

export default DashboardLayout;
