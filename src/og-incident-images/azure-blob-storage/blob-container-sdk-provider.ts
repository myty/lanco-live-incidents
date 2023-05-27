import {
    BlobServiceClient,
    ContainerClient,
    StorageSharedKeyCredential,
} from "@azure/storage-blob";
import {
    BlobContainerProvider,
    BlobContainerProviderOptions,
} from "./container-provider.ts";

export class BlobContainerSdkProvider extends BlobContainerProvider {
    private readonly _blobServiceClient: BlobServiceClient;
    private readonly _containerClient: ContainerClient;

    static create(
        options: BlobContainerProviderOptions,
    ): BlobContainerProvider {
        return new BlobContainerSdkProvider(options);
    }

    constructor(options: BlobContainerProviderOptions) {
        super(options);

        const sharedKeyCredential = new StorageSharedKeyCredential(
            this.blobConfiguration.AccountName,
            this.blobConfiguration.AccountKey,
        );

        this._blobServiceClient = new BlobServiceClient(
            this.blobConfiguration.BlobEndpoint,
            sharedKeyCredential,
        );

        this._containerClient = this._blobServiceClient.getContainerClient(
            this.container,
        );
    }

    async getBlockBlob(name: string): Promise<Response> {
        const blockBlobClient = this._containerClient.getBlockBlobClient(name);
        const buffer = await blockBlobClient.downloadToBuffer();
        return new Response(buffer);
    }

    async saveBlockBlob(
        name: string,
        buffer: ArrayBuffer,
        headers?: Record<string, string> | undefined,
    ): Promise<Response> {
        const blockBlobClient = this._containerClient.getBlockBlobClient(name);
        const { _response, ...result } = await blockBlobClient.uploadData(
            buffer,
            {
                blobHTTPHeaders: {
                    blobContentType: "image/png",
                },
            },
        );

        return Response.json(result);
    }

    async deleteIfExists(): Promise<Response | undefined> {
        const { _response, ...result } = await this._containerClient
            .deleteIfExists();

        return Response.json(result);
    }

    async createIfNotExists(): Promise<Response | undefined> {
        const { _response, ...result } = await this._containerClient
            .createIfNotExists();

        return Response.json(result);
    }
}
