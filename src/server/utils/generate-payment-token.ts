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
  console.log({ decoded });
  return decoded;
}

// {
//   "transaction_code":"00094GS",
//   "status":"COMPLETE",
//   "total_amount":"2,700.0",
//   "transaction_uuid":"1733133399321-3c709af7-23b9-4083-b89c-1a6d50480004",
//   "product_code":"EPAYTEST",
//   "signed_field_names":"transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names",
//   "signature":"gzvlXYw1Oe6rh0W/9ifhdkKfxrEyWHItdLW1fT5kO4I="
// }
