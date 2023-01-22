import { BlobContainerProvider } from "./container-provider.ts";
import {
    assert,
    assertEquals,
    assertExists,
} from "https://deno.land/std@0.173.0/testing/asserts.ts";
import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    it,
} from "https://deno.land/std@0.173.0/testing/bdd.ts";
import { Status } from "https://deno.land/std@0.173.0/http/http_status.ts";

const azureBlobStorageConnectionString = (
    Deno.args.length > 0 ? Deno.args[0] : undefined
)!;

describe(
    "BlobContainerProvider",
    {
        ignore: azureBlobStorageConnectionString == null,
    },
    () => {
        // const blobContainerProvider = new BlobContainerProvider({
        //     container: `test-og-images-${crypto.randomUUID()}`,
        //     connectionString: azureBlobStorageConnectionString,
        // });

        it("has dom parser available", () => {
            console.log("dom log", {
                document: document.nodeName,
                DOMParser: DOMParser.name,
                Node: Node.name,
                XMLSerializer: XMLSerializer.name,
            });
        });

        // it("initializes", () => {
        //     assertExists(blobContainerProvider);
        // });

        // describe("createIfNotExists()", () => {
        //     afterEach(async () => {
        //         await blobContainerProvider.deleteIfExists();
        //     });

        //     it("can create a container", async () => {
        //         await blobContainerProvider.createIfNotExists();
        //     });

        //     it("can create a container, and ignore if it already exists", async () => {
        //         await blobContainerProvider.createIfNotExists();
        //         await blobContainerProvider.createIfNotExists();
        //     });
        // });

        // describe("saving and retrieving blobs", () => {
        //     const blobName = `test-image-${crypto.randomUUID()}`;
        //     const testBlob = { test: "test content" };

        //     beforeAll(async () => {
        //         await blobContainerProvider.createIfNotExists();
        //     });

        //     afterAll(async () => {
        //         await blobContainerProvider.deleteIfExists();
        //     });

        //     it("can save a blob to the container", async () => {
        //         const result = await blobContainerProvider.saveBlockBlob(
        //             blobName,
        //             Response.json(testBlob),
        //         );

        //         assert(result);
        //     });

        //     it("can get a blob from the container", async () => {
        //         const result = await blobContainerProvider.getBlockBlob(
        //             blobName,
        //         );

        //         assertEquals(result.status, Status.OK);
        //     });

        //     it("can read the contents of a blob from the container", async () => {
        //         const result = await blobContainerProvider.getBlockBlob(
        //             blobName,
        //         );

        //         const blobJson = await result.json();

        //         assertEquals(blobJson, testBlob);
        //     });

        //     it("returns an a status not ok for nonexistant blob", async () => {
        //         const result = await blobContainerProvider.getBlockBlob(
        //             `${blobName}+${crypto.randomUUID()}`,
        //         );

        //         assertEquals(result.status, Status.NotFound);
        //     });
        // });
    },
);
