import {
    assert,
    assertEquals,
    assertExists,
} from "https://deno.land/std@0.158.0/testing/asserts.ts";
import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    it,
} from "https://deno.land/std@0.165.0/testing/bdd.ts";
import { Status } from "https://deno.land/std@0.170.0/http/http_status.ts";
import { BlobContainerSdkProvider } from "./blob-container-sdk-provider.ts";
import { loadFromLocalSettings } from "../testing-utils.ts";

loadFromLocalSettings();

describe(
    "BlobContainerSdkProvider",
    { ignore: true },
    () => {
        const blobContainerProvider = new BlobContainerSdkProvider({
            container: `test-og-images-${crypto.randomUUID()}`,
        });

        it("initializes", () => {
            assertExists(blobContainerProvider);
        });

        describe("createIfNotExists()", () => {
            afterEach(async () => {
                const response = await blobContainerProvider.deleteIfExists();
                await response?.body?.cancel();
            });

            it("can create a container", async () => {
                const response = await blobContainerProvider
                    .createIfNotExists();
                await response?.body?.cancel();
            });

            it("can create a container, and ignore if it already exists", async () => {
                const response1 = await blobContainerProvider
                    .createIfNotExists();
                const response2 = await blobContainerProvider
                    .createIfNotExists();
                await response1?.body?.cancel();
                await response2?.body?.cancel();
            });
        });

        describe("saving and retrieving blobs", () => {
            const blobName = `test-image-${crypto.randomUUID()}`;
            const testBlob = { test: "test content" };

            beforeAll(async () => {
                const response = await blobContainerProvider
                    .createIfNotExists();
                await response?.body?.cancel();
            });

            afterAll(async () => {
                const response = await blobContainerProvider.deleteIfExists();
                await response?.body?.cancel();
            });

            it("can save a blob to the container", async () => {
                const buffer = await Response.json({
                    test: "test content",
                }).arrayBuffer();

                const result = await blobContainerProvider.saveBlockBlob(
                    blobName,
                    buffer,
                );

                assert(result);
                await result.body?.cancel();
            });

            it("can get a blob from the container", async () => {
                const result = await blobContainerProvider.getBlockBlob(
                    blobName,
                );

                assertEquals(result.status, Status.OK);
                await result.body?.cancel();
            });

            it("can read the contents of a blob from the container", async () => {
                const result = await blobContainerProvider.getBlockBlob(
                    blobName,
                );

                const blobJson = await result.json();

                assertEquals(blobJson, testBlob);
            });

            it("returns an a status not ok for nonexistant blob", async () => {
                const result = await blobContainerProvider.getBlockBlob(
                    `${blobName}+${crypto.randomUUID()}`,
                );

                assertEquals(result.status, Status.NotFound);
                await result.body?.cancel();
            });
        });
    },
);
