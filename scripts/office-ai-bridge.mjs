import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { Readable } from "node:stream";

const host = "127.0.0.1";
const port = Number(process.env.OFFICE_AI_BRIDGE_PORT || 8787);
const secret = process.env.OFFICE_AI_BRIDGE_TOKEN || "";

if (secret.length < 32) {
  throw new Error("OFFICE_AI_BRIDGE_TOKEN must be set to a long random value before starting the Office AI bridge.");
}

const targets = {
  "/ollama": "http://127.0.0.1:11434",
  "/comfy": "http://127.0.0.1:8188",
};

function validKey(value = "") {
  const supplied = Buffer.from(value);
  const expected = Buffer.from(secret);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function routeFor(pathname) {
  return Object.entries(targets).find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);

  if (url.pathname === "/_health") {
    response.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  if (!validKey(String(request.headers["x-masonarc-office-key"] || ""))) {
    response.writeHead(401, { "content-type": "application/json", "cache-control": "no-store" });
    response.end(JSON.stringify({ error: "Unauthorized office AI bridge request." }));
    return;
  }

  const route = routeFor(url.pathname);
  if (!route) {
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "Unknown office AI service." }));
    return;
  }

  const [prefix, origin] = route;
  const target = `${origin}${url.pathname.slice(prefix.length) || "/"}${url.search}`;
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (value && !["host", "connection", "x-masonarc-office-key"].includes(name.toLowerCase())) {
      headers.set(name, Array.isArray(value) ? value.join(", ") : value);
    }
  }

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method || "GET")
        ? undefined
        : Readable.toWeb(request),
      // Required by Node when streaming a request body.
      duplex: "half",
    });

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete("connection");
    responseHeaders.delete("transfer-encoding");
    response.writeHead(upstream.status, Object.fromEntries(responseHeaders.entries()));
    if (upstream.body) Readable.fromWeb(upstream.body).pipe(response);
    else response.end();
  } catch {
    response.writeHead(502, { "content-type": "application/json", "cache-control": "no-store" });
    response.end(JSON.stringify({ error: "Office AI service is unavailable." }));
  }
}).listen(port, host, () => {
  console.log(`Mason & Arc Office AI bridge listening on ${host}:${port}`);
});
