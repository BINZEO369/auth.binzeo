import { isoBase64URL } from "@simplewebauthn/server/helpers";

export function webauthnConfig(req: Request) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const rpID = process.env.NEXT_PUBLIC_WEBAUTHN_RP_ID ?? new URL(origin).hostname;
  return { origin, rpID };
}

export function byteaFromBase64Url(value: string) {
  return `\\x${Buffer.from(value, "base64url").toString("hex")}`;
}

export function base64UrlFromBytea(value: unknown) {
  if (typeof value === "string") {
    const hex = value.startsWith("\\x") ? value.slice(2) : value;
    return isoBase64URL.fromBuffer(Buffer.from(hex, "hex"));
  }
  if (value instanceof Uint8Array) return isoBase64URL.fromBuffer(value as Uint8Array<ArrayBuffer>);
  return "";
}
