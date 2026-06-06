import ExcuseForm from "@/components/ExcuseForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-8 md:px-30 py-8 bg-white border-b-4 border-black shadow-[0_8px_0_#000]">
        <div className="flex items-center gap-4">
          <div
            className="text-[40px] font-black tracking-[-0.04em] bg-[#FFE600] px-3 border-4 border-black shadow-[4px_4px_0_#000] leading-none py-1"
            style={{ transform: "rotate(-2deg)" }}
          >
            BAIL.
          </div>
          <div className="text-sm font-extrabold uppercase tracking-widest border-2 border-black rounded-full px-4 py-2 bg-white">
            Beta v0.9
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-base font-extrabold">
            Credits: <span style={{ color: "#FF2A2A" }}>12 remaining</span>
          </div>
          <div
            className="w-12 h-12 rounded-full border-[3px] border-black flex items-center justify-center font-extrabold text-xl"
            style={{ backgroundColor: "#CC99FF", boxShadow: "4px 4px 0 #000" }}
          >
            👤
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-8 md:px-30 py-10">
        <ExcuseForm />
      </main>
    </div>
  );
}
