import { HeaderConstants } from "https://raw.githubusercontent.com/Azure/azure-sdk-for-js/%40azure/storage-blob_12.14.0/sdk/storage/storage-blob/src/utils/constants.ts";
import { computeHMACSHA256 } from "../crypto/crypto.ts";

export class BlobContainerAuthentication {
    constructor(
        private readonly accountName: string,
        private readonly accountKey: string,
    ) {}

    async createSignatureFromRequest(request: Request) {
        const unsignedSignature = this.createUnsignedSignature(request);

        return {
            unsigned: unsignedSignature,
            signed: await computeHMACSHA256(
                unsignedSignature,
                this.accountKey,
            ),
        };
    }

    private createUnsignedSignature(request: Request): string {
        const headerValues = [
            HeaderConstants.CONTENT_ENCODING,
            HeaderConstants.CONTENT_LANGUAGE,
            HeaderConstants.CONTENT_LENGTH,
            HeaderConstants.CONTENT_MD5,
            HeaderConstants.CONTENT_TYPE,
            HeaderConstants.DATE,
            HeaderConstants.IF_MODIFIED_SINCE,
            HeaderConstants.IF_MATCH,
            HeaderConstants.IF_NONE_MATCH,
            HeaderConstants.IF_UNMODIFIED_SINCE,
            HeaderConstants.RANGE,
        ].map((key) => this.getHeaderValueToSign(request, key));

        return [
            request.method.toUpperCase(),
            ...headerValues,
            ...this.getCanonicalizedHeaders(request),
            ...this.getCanonicalizedResource(request),
        ].join("\n");
    }

    /**
     * Retrieve header value according to shared key sign rules.
     * @see https://docs.microsoft.com/en-us/rest/api/storageservices/authenticate-with-shared-key
     *
     * @param request -
     * @param headerName -
     */
    private getHeaderValueToSign(request: Request, headerName: string): string {
        const value = request.headers.get(headerName);

        if (!value) {
            return "";
        }

        // When using version 2015-02-21 or later, if Content-Length is zero, then
        // set the Content-Length part of the StringToSign to an empty string.
        // https://docs.microsoft.com/en-us/rest/api/storageservices/authenticate-with-shared-key
        if (headerName === HeaderConstants.CONTENT_LENGTH && value === "0") {
            return "";
        }

        return value;
    }

    private getCanonicalizedHeaders(request: Request): string[] {
        const canonicalizedHeaders = Array.from(request.headers.entries())
            .map(([name, value]) => ({ name, value }))
            .filter((value) => {
                return value.name
                    .toLowerCase()
                    .startsWith(HeaderConstants.PREFIX_FOR_STORAGE);
            })
            .sort((a, b): number => {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            })
            .filter((value, index, array) => {
                if (
                    index > 0 &&
                    value.name.toLowerCase() ===
                        array[index - 1].name.toLowerCase()
                ) {
                    return false;
                }
                return true;
            })
            .map(
                (header) =>
                    `${header.name.toLowerCase().trimEnd()}:${header.value.trimStart()}`,
            );

        return canonicalizedHeaders;
    }

    /**
     * Retrieves the webResource canonicalized resource string.
     *
     * @param request -
     */
    private getCanonicalizedResource(request: Request): string[] {
        const path = getURLPath(request.url);
        const canonicalizedResource = [`/${this.accountName}${path}`];
        const queries = getURLQueries(request.url);
        const lowercaseQueries: { [key: string]: string } = {};

        if (queries) {
            const queryKeys: string[] = [];
            for (const key in queries) {
                if (Object.prototype.hasOwnProperty.call(queries, key)) {
                    const lowercaseKey = key.toLowerCase();
                    lowercaseQueries[lowercaseKey] = queries[key];
                    queryKeys.push(lowercaseKey);
                }
            }

            queryKeys.sort();
            for (const key of queryKeys) {
                canonicalizedResource.push(
                    `${key}:${decodeURIComponent(lowercaseQueries[key])}`,
                );
            }
        }

        return canonicalizedResource;
    }
}

function getURLQueries(url: string) {
    const parsedUrl = new URL(url);

    return Array.from(parsedUrl.searchParams.entries())
        .map(([name, value]) => ({ name, value }))
        .reduce((prev, curr) => {
            return {
                ...prev,
                [curr.name]: curr.value,
            };
        }, {} as Record<string, string>);
}

function getURLPath(url: string): string {
    const { pathname } = new URL(url);
    return pathname ?? "/";
}
