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
import { BlobContainerRestProvider } from "./blob-container-rest-provider.ts";
import { loadFromLocalSettings } from "../testing-utils.ts";

loadFromLocalSettings();

describe({
    name: "BlobContainerRestProvider",
    sanitizeOps: false,
    fn: () => {
        const blobContainerProvider = new BlobContainerRestProvider({
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
                // Arrange, Act
                const response = await blobContainerProvider
                    .createIfNotExists();

                // Assert
                assertEquals(response.status, Status.Created);

                // Cleanup
                await response?.body?.cancel();
            });

            it("can create a container, and ignore if it already exists", async () => {
                // Arrange, Act
                const response1 = await blobContainerProvider
                    .createIfNotExists();
                const response2 = await blobContainerProvider
                    .createIfNotExists();

                // Assert
                assertEquals(response1.status, Status.Created);
                assertEquals(response2.status, Status.Conflict);

                // Cleanup
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
                // Arrange
                const buffer = await Response.json({
                    test: "test content",
                }).arrayBuffer();

                // Act
                const response = await blobContainerProvider.saveBlockBlob(
                    blobName,
                    buffer,
                );

                // Assert
                assertEquals(response.status, Status.Created);

                // Cleanup
                await response.body?.cancel();
            });

            it("can get a blob from the container", async () => {
                // Arrange, Act
                const result = await blobContainerProvider.getBlockBlob(
                    blobName,
                );

                // Assert
                assertEquals(result.status, Status.OK);

                // Cleanup
                await result.body?.cancel();
            });

            it("can read the contents of a blob from the container", async () => {
                // Arrange, Act
                const result = await blobContainerProvider.getBlockBlob(
                    blobName,
                );

                // Assert
                const blobJson = await result.json();
                assertEquals(blobJson, testBlob);
                assertEquals(result.status, Status.OK);
            });

            it("returns an a status not ok for nonexistant blob", async () => {
                // Arrange, Act
                const result = await blobContainerProvider.getBlockBlob(
                    `${blobName}+${crypto.randomUUID()}`,
                );

                // Assert
                assertEquals(result.status, Status.NotFound);

                // Cleanup
                await result.body?.cancel();
            });
        });
    },
});
