import React from "https://esm.sh/react@18.2.0";
import { ImageResponse } from "https://deno.land/x/og_edge@0.0.4/mod.ts";
import { BlobServiceClient, BlockBlobClient } from "npm:@azure/storage-blob";

const BLOB_CACHE_ENABLED = false;

const azureBlobConnectionInfo = getAzureBlobConnectionInfo();
const blobServiceClient = BlobServiceClient.fromConnectionString(
    azureBlobConnectionInfo["ConnectionString"],
);
const containerClient = blobServiceClient.getContainerClient("og-images");

export default async function handler(req: Request): Promise<Response> {
    const id = new URL(req.url).searchParams.get("id");

    if (id == null) {
        return new Response(null, { status: 500 });
    }

    await containerClient.createIfNotExists();
    const blobClient = containerClient.getBlockBlobClient(`${id}.png`);

    if (BLOB_CACHE_ENABLED && (await blobClient.exists())) {
        return await getCachedBlob(blobClient);
    }

    const incident = await getIncident(id);

    const imageResponse = new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                backgroundColor: "rgb(30 58 138)",
                fontFamily: "Vera",
            }}
        >
            <div style={{ fontSize: 40, fontWeight: "700" }}>
                {incident?.type}
            </div>
            <div style={{ fontSize: 64 }}>{incident?.subType}</div>
            <div style={{ fontSize: 36 }}>{incident?.location}</div>
        </div>,
        {
            width: 1200,
            height: 630,
        },
    );

    if (BLOB_CACHE_ENABLED && incident != null) {
        await cacheImageResponse(blobClient, imageResponse);
    }

    return imageResponse;
}

async function getIncident(id: string) {
    const apiFeed = Deno.env.get("IncidentsApi");

    if (apiFeed == null) {
        return undefined;
    }

    const response = await fetch(apiFeed);
    const incidents: Array<{
        id: string;
        location: string;
        type: string;
        subType: string;
    }> = await response.json();

    return incidents.find((incident) => incident.id === id);
}

async function cacheImageResponse(
    blobClient: BlockBlobClient,
    imageResponse: ImageResponse,
) {
    await blobClient.uploadData(await imageResponse.clone().arrayBuffer(), {
        blobHTTPHeaders: {
            blobCacheControl:
                "no-transform, public, max-age=31536000, immutable",
            blobContentType: "image/png",
        },
    });
}

async function getCachedBlob(blobClient: BlockBlobClient) {
    const cachedResponse = new Response(await blobClient.downloadToBuffer());
    cachedResponse.headers.append(
        "Cache-Control",
        "no-transform, public, max-age=31536000, immutable",
    );
    cachedResponse.headers.append("Content-Type", "image/png");
    return cachedResponse;
}

function getAzureBlobConnectionInfo() {
    const azureBlobConnectionString = Deno.env.get("AzureBlobStorage") ?? "";

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
        { ConnectionString: azureBlobConnectionString } as Record<
            string,
            string
        >,
    );
}
