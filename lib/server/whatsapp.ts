type WhatsAppConfig = {
  accessToken: string;
  phoneNumberId: string;
  graphApiVersion: string;
};

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}.`);
  return value;
}

function config(): WhatsAppConfig {
  return {
    accessToken: required("WHATSAPP_ACCESS_TOKEN"),
    phoneNumberId: required("WHATSAPP_PHONE_NUMBER_ID"),
    graphApiVersion: required("WHATSAPP_GRAPH_API_VERSION"),
  };
}

function recipientNumber(value: string) {
  const number = value.replace(/[^0-9]/g, "");
  if (!/^[1-9][0-9]{7,14}$/.test(number)) {
    throw new Error("Use a valid international WhatsApp number, including country code.");
  }
  return number;
}

export function getWhatsAppStatus() {
  return {
    configured: Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_GRAPH_API_VERSION),
    sendingEnabled: process.env.WHATSAPP_ALLOW_SEND === "true",
    webhookConfigured: Boolean(process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN && process.env.META_APP_SECRET),
  };
}

export async function sendWhatsAppText({ to, text }: { to: string; text: string }) {
  if (process.env.WHATSAPP_ALLOW_SEND !== "true") {
    throw new Error("WhatsApp sending is disabled until it is explicitly enabled in the server environment.");
  }
  const message = text.trim();
  if (!message || message.length > 4096) throw new Error("WhatsApp text must be between 1 and 4096 characters.");
  const settings = config();
  const response = await fetch(`https://graph.facebook.com/${encodeURIComponent(settings.graphApiVersion)}/${encodeURIComponent(settings.phoneNumberId)}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${settings.accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: recipientNumber(to), type: "text", text: { body: message } }),
  });
  const body = await response.json().catch(() => ({})) as { messages?: { id?: string }[]; error?: { message?: string } };
  if (!response.ok) throw new Error(body.error?.message || "WhatsApp Cloud API could not send the message.");
  const messageId = body.messages?.[0]?.id;
  if (!messageId) throw new Error("WhatsApp Cloud API did not return a message id.");
  return { messageId };
}
