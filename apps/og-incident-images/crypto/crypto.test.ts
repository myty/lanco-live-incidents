import { computeHMACSHA256 } from "./crypto.ts";
import { createHmac } from "node:crypto";
import { Buffer } from "node:buffer";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.158.0/testing/asserts.ts";

const accountKey =
  "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";
const stringToSign =
  "GET\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:Fri, 26 Jun 2015 23:39:12 GMT\nx-ms-version:2015-02-21\n/myaccount/mycontainer\ncomp:metadata\nrestype:container\ntimeout:20";

Deno.test("computeHMACSHA256() creates a computed hash of provided signature", async () => {
  // Arrange, Act
  const denoHash = await computeHMACSHA256(stringToSign, accountKey);

  // Assert
  assertExists(denoHash);
});

Deno.test("computeHMACSHA256() creates the same computed hash as node", async () => {
  // Arrange
  const decodedAccountKey = Buffer.from(
    accountKey,
    "base64",
  );

  const nodeHash = createHmac("sha256", decodedAccountKey)
    .update(stringToSign, "utf8")
    .digest("base64");

  // Act
  const denoHash = await computeHMACSHA256(stringToSign, accountKey);

  // Assert
  assertEquals(denoHash, nodeHash);
});

Deno.test("computeHMACSHA256() creates the same computed hash as azurite", async () => {
  // Arrange
  const stringToSign =
    "DELETE\n\n\n\n\n\n\n\n\n\n\n\nx-ms-client-request-id:8eb16762-0585-4cfb-b19c-2bc14c01ac84\nx-ms-date:Sat, 27 May 2023 14:48:31 GMT\nx-ms-version:2022-11-02\n/devstoreaccount1/devstoreaccount1/test-og-images-d51d37d5-3f15-4aa5-a707-b90a0081010f\nrestype:container";
  const expectedHash = "QWGhSZroOflyLOYur8w6uKeUgYs4IhiM98sJSg+Amxg=";

  // Act
  const denoHash = await computeHMACSHA256(stringToSign, accountKey);

  // Assert
  assertEquals(denoHash, expectedHash);
});
