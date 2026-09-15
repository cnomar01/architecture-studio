import { getDb } from "@/lib/server/db";
import { requireServerUser } from "@/lib/server/auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try { await requireServerUser(); } catch (error) { return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } }); }
  const encoder = new TextEncoder();
  let cleanupStream: (() => Promise<void>) | null = null;
  const stream = new ReadableStream({
    async start(controller) {
      const client = await getDb().connect();
      let closed = false;
      const send = (data: unknown) => { if (!closed) controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)); };
      const cleanup = async () => { if (closed) return; closed = true; client.removeAllListeners("notification"); await client.query("UNLISTEN studio_events").catch(() => {}); client.release(); try { controller.close(); } catch {} };
      cleanupStream = cleanup;
      client.on("notification", (msg) => send({ type: "studio_event", payload: msg.payload ? JSON.parse(msg.payload) : null }));
      await client.query("LISTEN studio_events");
      send({ type: "connected", at: new Date().toISOString() });
      const heartbeat = setInterval(() => send({ type: "heartbeat", at: new Date().toISOString() }), 15000);
      setTimeout(async () => { clearInterval(heartbeat); await cleanup(); }, 55 * 60 * 1000);
    },
    async cancel() { if (cleanupStream) await cleanupStream(); },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}
