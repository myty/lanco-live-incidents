import {
    BlobContainerProvider,
    BlobContainerProviderOptions,
} from "./container-provider.ts";
import { HeaderConstants, HttpStatus, SERVICE_VERSION } from "../deps.ts";
import { BlobContainerAuthentication } from "./blob-container-authentication.ts";

interface RequestOption<TBody extends BodyInit = BodyInit> {
    body?: TBody;
    headers?: Record<string, string>;
    method: "PUT" | "GET" | "DELETE";
    restype?: "container";
    url: URL;
}

export class BlobContainerRestProvider extends BlobContainerProvider {
    private readonly blobContainerAuthenitcation: BlobContainerAuthentication;

    static create(
        options: BlobContainerProviderOptions,
    ): BlobContainerProvider {
        return new BlobContainerRestProvider(options);
    }

    constructor(options: BlobContainerProviderOptions) {
        super(options);

        this.blobContainerAuthenitcation = new BlobContainerAuthentication(
            this.blobConfiguration.AccountName,
            this.blobConfiguration.AccountKey,
        );
    }

    public async getBlockBlob(name: string): Promise<Response> {
        try {
            const url = this.buildUrl(`${this.container}/${name}`);
            const method = "GET";

            return await this.request({ method, url });
        } catch (error) {
            if (`${error}`.includes("The specified blob does not exist.")) {
                return new Response(`${error}`, {
                    status: HttpStatus.NotFound,
                });
            }

            return new Response(`${error}`, { status: HttpStatus.BadRequest });
        }
    }

    public async saveBlockBlob(
        name: string,
        buffer: ArrayBuffer,
        headers: Record<string, string> = {},
    ): Promise<Response> {
        try {
            const processedHeaders = "x-ms-blob-type" in headers
                ? headers
                : { ...headers, "x-ms-blob-type": "BlockBlob" };

            const response = await this.request({
                body: buffer,
                headers: processedHeaders,
                method: "PUT",
                url: this.buildUrl(`${this.container}/${name}`),
            });

            return response;
        } catch (error) {
            return new Response(`${error}`, { status: HttpStatus.BadRequest });
        }
    }

    public async deleteIfExists() {
        try {
            const response = await this.request({
                method: "DELETE",
                url: this.buildUrl(`${this.container}`),
                restype: "container",
            });

            return response;
        } catch (error) {
            return new Response(`${error}`, { status: HttpStatus.BadRequest });
        }
    }

    public async createIfNotExists() {
        try {
            const url = this.buildUrl(`${this.container}`);
            const method = "PUT";
            const restype = "container";

            return await this.request({ method, url, restype });
        } catch (error) {
            return new Response(`${error}`, { status: HttpStatus.BadRequest });
        }
    }

    private buildUrl(path: string): URL {
        const baseEndpoint = this.blobConfiguration.BlobEndpoint.endsWith(
                "/",
            )
            ? this.blobConfiguration.BlobEndpoint
            : `${this.blobConfiguration.BlobEndpoint}/`;

        return new URL(`${baseEndpoint}${path}`);
    }

    private async request<TBody extends BodyInit = BodyInit>({
        body,
        headers,
        method,
        restype,
        url,
    }: RequestOption<TBody>): Promise<Response> {
        try {
            if (restype != null) {
                url.searchParams.append("restype", restype);
            }

            const requestInit = body != null ? { body } : {};
            const request = new Request(url, { ...requestInit, method });

            if (headers != null) {
                for (const key in headers) {
                    if (Object.prototype.hasOwnProperty.call(headers, key)) {
                        request.headers.append(key, headers[key]);
                    }
                }
            }

            request.headers.set(
                HeaderConstants.CONTENT_LENGTH,
                `${await getContentLength(request)}`,
            );

            const signedRequest = await this.signRequest(request);

            return await fetch(signedRequest);
        } catch (error) {
            throw new AggregateError([error], "request()");
        }
    }

    private async signRequest(request: Request): Promise<Request> {
        request.headers.set(
            HeaderConstants.X_MS_DATE,
            new Date().toUTCString(),
        );

        request.headers.set(
            HeaderConstants.X_MS_CLIENT_REQUEST_ID,
            crypto.randomUUID(),
        );

        request.headers.set(HeaderConstants.X_MS_VERSION, SERVICE_VERSION);

        const { signed: signature } = await this.blobContainerAuthenitcation
            .createSignatureFromRequest(request);

        request.headers.set(
            HeaderConstants.AUTHORIZATION,
            `SharedKey ${this.blobConfiguration.AccountName}:${signature}`,
        );

        return request;
    }
}

async function getContentLength(request: Request) {
    if (request.body) {
        const blob = await request.clone().blob();

        return blob.size;
    }

    return 0;
}
