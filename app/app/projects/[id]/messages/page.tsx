import Link from "next/link";

const messages = [
  {
    sender: "Mason & Arc",
    message:
      "The latest Design Development package is now available for review.",
    date: "Today · 10:42",
  },
  {
    sender: "Mason & Arc",
    message:
      "Material selections have been updated based on our last meeting.",
    date: "Yesterday · 16:20",
  },
];

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <header className="flex items-center justify-between px-6 py-6 md:px-10">
        <Link
          href={`/app/projects/${id}`}
          className="text-xs uppercase tracking-[0.18em] text-white/50 hover:text-white"
        >
          ← Project
        </Link>

        <Link href="/app">
          <img
            src="/images/logo-mason-arc.png"
            alt="Mason & Arc"
            className="h-8 w-auto"
          />
        </Link>

        <span className="w-10" />
      </header>

      <section className="px-6 pb-32 pt-16 md:px-10 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
            Communication
          </p>

          <h1 className="mt-5 text-5xl font-light tracking-[-0.05em] md:text-7xl">
            Messages
          </h1>

          <div className="mt-16 space-y-3">
            {messages.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 p-6 md:p-8"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/40">
                      {item.sender}
                    </p>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">
                      {item.message}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-[10px] text-white/25">
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 p-6">
            <textarea
              placeholder="Write a message..."
              className="min-h-32 w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/20"
            />

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="rounded-full bg-white px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-black transition hover:bg-white/80"
              >
                Send message
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}