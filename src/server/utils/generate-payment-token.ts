import crypto from "crypto";

export function generateEsewaSignature(
  secretKey: string,
  message: string,
): string {
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
  return hash;
}

export function decodeEsewaSignature(data: string) {
  const decoded = atob(data);
  return decoded;
}
