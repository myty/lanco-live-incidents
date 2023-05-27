import {
    decode as base64Decode,
    encode as base64Encode,
} from "https://deno.land/std@0.170.0/encoding/base64.ts";

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
