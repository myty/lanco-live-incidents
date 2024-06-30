import {
  decodeBase64,
  encodeBase64,
} from "jsr:@std/encoding@1.0.0-rc.2/base64";

export async function computeHMACSHA256(
  stringToSign: string,
  accountKey: string,
): Promise<string> {
  const decodedAccountKey = decodeBase64(accountKey);

  const hmacCryptoKey = await crypto.subtle.importKey(
    "raw",
    decodedAccountKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const signature = await crypto.subtle.sign("HMAC", hmacCryptoKey, data);
  return encodeBase64(signature);
}
