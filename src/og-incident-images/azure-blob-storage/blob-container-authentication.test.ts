import { assertEquals } from "https://deno.land/std@0.158.0/testing/asserts.ts";
import { BlobContainerAuthentication } from "./blob-container-authentication.ts";
import {
    HeaderConstants,
    SERVICE_VERSION,
} from "https://raw.githubusercontent.com/Azure/azure-sdk-for-js/%40azure/storage-blob_12.14.0/sdk/storage/storage-blob/src/utils/constants.ts";

const accountName = "devstoreaccount1";
const accountKey =
    "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";

Deno.test("BlobContainerAuthentication.createSignatureFromRequest creates valid unsigned signature", async () => {
    // Arrange
    const expectedSigned = "QWGhSZroOflyLOYur8w6uKeUgYs4IhiM98sJSg+Amxg=";
    const expectedUnsigned =
        "DELETE\n\n\n\n\n\n\n\n\n\n\n\nx-ms-client-request-id:8eb16762-0585-4cfb-b19c-2bc14c01ac84\nx-ms-date:Sat, 27 May 2023 14:48:31 GMT\nx-ms-version:2022-11-02\n/devstoreaccount1/devstoreaccount1/test-og-images-d51d37d5-3f15-4aa5-a707-b90a0081010f\nrestype:container";
    const blobContainerAuthenitcation = new BlobContainerAuthentication(
        accountName,
        accountKey,
    );
    const request = new Request(
        "http://127.0.0.1:10000/devstoreaccount1/test-og-images-d51d37d5-3f15-4aa5-a707-b90a0081010f?restype=container",
        {
            method: "DELETE",
        },
    );

    request.headers.set(
        HeaderConstants.X_MS_DATE,
        "Sat, 27 May 2023 14:48:31 GMT",
    );

    request.headers.set(
        HeaderConstants.X_MS_CLIENT_REQUEST_ID,
        "8eb16762-0585-4cfb-b19c-2bc14c01ac84",
    );

    request.headers.set(HeaderConstants.X_MS_VERSION, SERVICE_VERSION);

    // Act
    const { unsigned, signed } = await blobContainerAuthenitcation
        .createSignatureFromRequest(request);

    // Assert
    assertEquals(unsigned, expectedUnsigned);
    assertEquals(signed, expectedSigned);
});
