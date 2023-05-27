import { base64Decode, base64Encode } from "../deps.ts";

export async function computeHMACSHA256(
    stringToSign: string,
    accountKey: string,
): Promise<string> {
    const decodedAccountKey = base64Decode(accountKey);

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
    return base64Encode(signature);
}
