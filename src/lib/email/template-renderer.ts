import { escapeEmailText, renderEmailLayout } from "@/lib/email/layout";

export type EmailContentBlock =
  | { id: string; type: "headline"; text: string }
  | { id: string; type: "message"; text: string }
  | { id: string; type: "button"; label: string; url: string };

export type EmailTemplateRenderInput = {
  template_type: string;
  theme?: string | null;
  subject?: string | null;
  preview_text?: string | null;
  headline?: string | null;
  message?: string | null;
  button_label?: string | null;
  button_url?: string | null;
  buttons?: unknown;
  images?: unknown;
  content_blocks?: unknown;
};

const BLOCK_LIMIT = 32;
const HTTPS_ONLY = /^https:\/\//i;

export function safeEmailUrl(value: unknown) {
  if (typeof value !== "string" || !HTTPS_ONLY.test(value.trim())) return "";
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function parseContentBlocks(value: unknown, strict = false): { blocks: EmailContentBlock[]; error?: string } {
  if (value == null) return { blocks: [] };
  if (!Array.isArray(value)) return { blocks: [], error: "Content blocks must be a list." };
  if (value.length > BLOCK_LIMIT) return { blocks: [], error: `Use no more than ${BLOCK_LIMIT} content blocks.` };

  const blocks: EmailContentBlock[] = [];
  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== "object") return { blocks: [], error: "A content block is invalid." };
    const row = item as Record<string, unknown>;
    const id = typeof row.id === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(row.id) ? row.id : `block-${index + 1}`;
    if (row.type === "headline" || row.type === "message") {
      const maxLength = row.type === "headline" ? 180 : 10000;
      const text = typeof row.text === "string" ? row.text.slice(0, maxLength) : "";
      if (strict && typeof row.text === "string" && row.text.length > maxLength) {
        return { blocks: [], error: `${row.type === "headline" ? "Headlines" : "Messages"} must be ${maxLength} characters or fewer.` };
      }
      blocks.push(row.type === "headline" ? { id, type: "headline", text } : { id, type: "message", text });
      continue;
    }
    if (row.type === "button") {
      const label = typeof row.label === "string" ? row.label.trim().slice(0, 80) : "";
      const rawUrl = typeof row.url === "string" ? row.url.trim() : "";
      const url = safeEmailUrl(rawUrl);
      if (strict && (label || rawUrl) && (!label || !url)) {
        return { blocks: [], error: "Each button needs a label and a valid HTTPS URL." };
      }
      if (strict && label.length > 80) return { blocks: [], error: "Button labels must be 80 characters or fewer." };
      blocks.push({ id, type: "button", label, url });
      continue;
    }
    return { blocks: [], error: "A content block type is not supported." };
  }
  return { blocks };
}

function personalize(text: string, name: string) {
  return escapeEmailText(text.replaceAll("{{name}}", name).replaceAll("[Name]", name)).replace(/\n/g, "<br>");
}

function safeImages(value: unknown) {
  return Array.isArray(value) ? value.slice(0, 8).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const url = safeEmailUrl(row.url);
    const position = ["top", "after_headline", "after_message", "before_button"].includes(String(row.position)) ? String(row.position) : "after_message";
    return url ? [{ url, position }] : [];
  }) : [];
}

function imageMarkup(images: ReturnType<typeof safeImages>, position: string, ink: string) {
  return images.filter((image) => image.position === position).map((image) => `<p style="margin:24px 0;text-align:center"><img src="${escapeEmailText(image.url)}" alt="" style="display:block;width:100%;max-width:560px;height:auto;border:0;margin:0 auto" /></p>`).join("");
}

function renderBlock(block: EmailContentBlock, ink: string, name: string, preview: boolean) {
  if (block.type === "headline") {
    const text = block.text || (preview ? "Headline preview" : "");
    return text ? `<h2 style="margin:28px 0 14px;color:${ink};font-size:22px;line-height:1.3;font-weight:750;letter-spacing:-.025em">${personalize(text, name)}</h2>` : "";
  }
  if (block.type === "message") {
    const text = block.text || (preview ? "Message preview" : "");
    return text ? `<div style="margin:0 0 18px;color:${ink};font-size:14px;line-height:1.7;white-space:pre-wrap">${personalize(text, name)}</div>` : "";
  }
  const label = block.label || (preview ? "Button preview" : "");
  if (!label) return "";
  if (!block.url) return preview ? `<div style="margin:0 0 14px"><span style="display:inline-block;border:1px solid ${ink};border-radius:6px;padding:10px 15px;color:${ink};font-size:13px;font-weight:700">${escapeEmailText(label)} →</span></div>` : "";
  return `<div style="margin:0 0 14px"><a href="${escapeEmailText(block.url)}" style="display:inline-block;border:1px solid ${ink};border-radius:6px;padding:10px 15px;color:${ink};font-size:13px;font-weight:700;text-decoration:none">${escapeEmailText(label)} →</a></div>`;
}

export function renderEmailTemplateHtml(template: EmailTemplateRenderInput, siteUrl: string, recipientName = "there", preview = false) {
  const name = recipientName.trim() || "there";
  const theme = template.theme === "light" ? "light" : "dark";
  const ink = theme === "light" ? "#000000" : "#ffffff";
  const type = template.template_type;
  const occasionBlocks = type === "occasion" ? parseContentBlocks(template.content_blocks).blocks : [];
  const blockMode = type === "occasion" && occasionBlocks.length > 0;
  const images = safeImages(template.images);
  const renderImages = (position: string) => imageMarkup(images, position, ink);
  const greeting = `<p style="margin:0 0 22px;color:${ink};font-size:16px;line-height:1.5;font-weight:700">Hey ${escapeEmailText(name)},</p>`;
  const preheader = typeof template.preview_text === "string" ? template.preview_text : "";
  let title = typeof template.headline === "string" ? template.headline : "";
  let body = "";

  if (blockMode) {
    title = "";
    const insertedImages = new Set<string>(["top"]);
    const parts = [greeting, renderImages("top")];
    const firstIndex = (type: EmailContentBlock["type"]) => occasionBlocks.findIndex((block) => block.type === type);
    const headlineIndex = firstIndex("headline");
    const messageIndex = firstIndex("message");
    const buttonIndex = firstIndex("button");
    occasionBlocks.forEach((block, index) => {
      if (index === buttonIndex && !insertedImages.has("before_button")) {
        parts.push(renderImages("before_button"));
        insertedImages.add("before_button");
      }
      parts.push(renderBlock(block, ink, name, preview));
      if (index === headlineIndex && !insertedImages.has("after_headline")) {
        parts.push(renderImages("after_headline"));
        insertedImages.add("after_headline");
      }
      if (index === messageIndex && !insertedImages.has("after_message")) {
        parts.push(renderImages("after_message"));
        insertedImages.add("after_message");
      }
    });
    for (const position of ["after_headline", "after_message", "before_button"]) {
      if (!insertedImages.has(position)) parts.push(renderImages(position));
    }
    body = parts.join("");
  } else {
    const headline = title || (preview ? "Headline preview" : "");
    title = headline;
    const messageText = typeof template.message === "string" && template.message.trim() ? template.message : (preview ? "Message preview" : "");
    const legacyButtons = Array.isArray(template.buttons) ? template.buttons.slice(0, 8).flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const row = item as Record<string, unknown>;
      const label = typeof row.label === "string" ? row.label.trim().slice(0, 80) : "";
      const url = safeEmailUrl(row.url);
      return label && url ? [{ label, url }] : [];
    }) : [];
    if (!legacyButtons.length && typeof template.button_label === "string" && template.button_label.trim()) {
      const url = safeEmailUrl(template.button_url);
      if (url) legacyButtons.push({ label: template.button_label.trim().slice(0, 80), url });
    }
    const buttonHtml = legacyButtons.map((button) => `<div style="padding:0 0 12px;text-align:left"><a href="${escapeEmailText(button.url)}" style="color:${ink};font-size:14px;font-weight:700;text-decoration:underline;text-underline-offset:4px">${escapeEmailText(button.label)} →</a></div>`).join("");
    body = `${greeting}${renderImages("top")}${renderImages("after_headline")}${messageText ? `<div style="color:${ink};font-size:14px;line-height:1.7;white-space:pre-wrap">${personalize(messageText, name)}</div>` : ""}${renderImages("after_message")}${renderImages("before_button")}${buttonHtml}`;
  }

  const footerLink = `${siteUrl.replace(/\/+$/, "")}/dashboard/profile#notifications`;
  const footerNote = type === "occasion"
    ? `You are receiving this occasion email because marketing emails are enabled in your BINZEO notification preferences. <a href="${escapeEmailText(footerLink)}" style="color:${ink};text-decoration:underline;">Manage email preferences</a>.`
    : type === "birthday"
      ? `A birthday wish from BINZEO. <a href="${escapeEmailText(footerLink)}" style="color:${ink};text-decoration:underline;">Manage email preferences</a>.`
      : `You are receiving this email because you allowed Marketing emails in your BINZEO notification preferences. <a href="${escapeEmailText(footerLink)}" style="color:${ink};text-decoration:underline;">Manage email preferences</a>.`;
  const eyebrow = type === "occasion" ? "BINZEO · OCCASION WISH" : type === "birthday" ? "BINZEO · BIRTHDAY" : "BINZEO · NEWS";
  return renderEmailLayout({ siteUrl, eyebrow, title: escapeEmailText(title), description: escapeEmailText(preheader), body, showSecurityDetails: false, theme, footerNote });
}
