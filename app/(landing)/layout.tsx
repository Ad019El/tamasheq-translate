import Footer from "@/components/footer";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-[#111827] overflow-auto ">
      <div>
        <div className="mx-auto max-w-screen-xl h-full w-full">{children}</div>
      </div>
      <div className="mx-auto max-w-screen-xl w-full">
        <Footer />
      </div>
    </main>
  );
};

export default LandingLayout;
