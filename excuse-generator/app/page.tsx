import ExcuseForm from "@/components/ExcuseForm";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50">
            Excuse Generator
          </h1>
          <p className="mt-3 text-zinc-400 text-base">
            Describe your situation and get a ready-to-send excuse.
          </p>
        </div>
        <ExcuseForm />
      </div>
    </main>
  );
}
