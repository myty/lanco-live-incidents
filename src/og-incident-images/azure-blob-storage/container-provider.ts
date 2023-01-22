import {
    BlobHTTPHeaders,
    BlobServiceClient,
    ContainerClient,
} from "@azure/storage-blob";
import { Status } from "https://deno.land/std@0.173.0/http/http_status.ts";

interface AzureBlobConnectionInfo {
    AccountKey: string;
    AccountName: string;
    BlobEndpoint: string;
    ConnectionString: string;
    DefaultEndpointsProtocol: string;
}

interface BlobContainerProviderOptions {
    container: string;
    connectionString?: string;
}

export class BlobContainerProvider {
    private readonly azureBlobConnectionInfo: AzureBlobConnectionInfo;
    private readonly blobServiceClient: BlobServiceClient;
    private readonly containerClient: ContainerClient;

    constructor(options: BlobContainerProviderOptions) {
        this.azureBlobConnectionInfo = this.getAzureBlobConnectionInfo(
            options.connectionString,
        );
        this.blobServiceClient = BlobServiceClient.fromConnectionString(
            this.azureBlobConnectionInfo.ConnectionString,
        );
        this.containerClient = this.blobServiceClient.getContainerClient(
            options.container,
        );
    }

    public async getBlockBlob(name: string): Promise<Response> {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(
                name,
            );

            const result = await blockBlobClient.download();

            return new Response(result.readableStreamBody?.read(), {
                status: result._response.status,
                headers: result._response.headers.rawHeaders(),
            });
        } catch (error) {
            if (`${error}`.includes("The specified blob does not exist.")) {
                return new Response(`${error}`, { status: Status.NotFound });
            }

            return new Response(`${error}`, { status: Status.BadRequest });
        }
    }

    public async saveBlockBlob(
        name: string,
        reponse: Response,
    ): Promise<boolean> {
        const blockBlobClient = this.containerClient.getBlockBlobClient(name);

        const blobResponse = await blockBlobClient.uploadData(
            await reponse.clone().arrayBuffer(),
            {
                blobHTTPHeaders: parseBlobHTTPHeaders(reponse),
            },
        );

        return blobResponse.errorCode == null;
    }

    public async deleteIfExists() {
        try {
            const _ = await this.containerClient.deleteIfExists();
        } catch (error) {
            throw error;
        }
    }

    public async createIfNotExists() {
        try {
            const _ = await this.containerClient.createIfNotExists();
        } catch (error) {
            throw error;
        }
    }

    private getAzureBlobConnectionInfo(
        connectionString?: string,
    ): AzureBlobConnectionInfo {
        const azureBlobConnectionString = connectionString ??
            Deno.env.get("AzureBlobStorage") ?? "";

        return azureBlobConnectionString.split(";").reduce(
            (obj, segment) => {
                const separatorIndex = segment.indexOf("=");

                if (separatorIndex < 0) {
                    return obj;
                }

                const key = segment.slice(0, separatorIndex);
                const value = segment.slice(separatorIndex + 1);

                return {
                    ...obj,
                    [key]: value,
                };
            },
            {
                ConnectionString: azureBlobConnectionString,
            } as AzureBlobConnectionInfo,
        );
    }
}

function parseBlobHTTPHeaders(response: Response): BlobHTTPHeaders | undefined {
    const headerTranslations: Record<string, string> = {
        ["Cache-Control"]: "blobCacheControl",
        ["Content-Type"]: "blobContentType",
    };

    if (
        !Object.keys(headerTranslations).some((key) =>
            response.headers.has(key)
        )
    ) {
        return undefined;
    }

    return Array.from(response.headers.entries())
        .map(([key, value]) => ({ key, value }))
        .reduce((prev, curr) => {
            if (curr.key in headerTranslations) {
                return {
                    ...prev,
                    [headerTranslations[curr.key]]: curr.value,
                };
            }

            return prev;
        }, {});
}
