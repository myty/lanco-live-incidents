import { HeaderConstants, ImageResponse, React } from "../deps.ts";
import { BlobContainerRestProvider } from "../azure-blob-storage/blob-container-rest-provider.ts";

const BLOB_CACHE_ENABLED = true;

const blobContainerProvider = BlobContainerRestProvider.create({
    container: "og-images",
});

export default async function handler(req: Request): Promise<Response> {
    const id = extractIdFromRequest(req);

    if (id == null) {
        return new Response(null, { status: 500 });
    }

    await blobContainerProvider.createIfNotExists();

    const blockBlobName = `${id}.png`;
    const foundBlob = await blobContainerProvider.getBlockBlob(blockBlobName);

    if (BLOB_CACHE_ENABLED && foundBlob.ok) {
        return foundBlob;
    }

    const incident = await getIncident(id);

    const imageResponse = new ImageResponse(
        (
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
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );

    if (BLOB_CACHE_ENABLED && incident != null) {
        const clonedResponse = imageResponse.clone();
        await blobContainerProvider.saveBlockBlob(
            blockBlobName,
            await clonedResponse.arrayBuffer(),
            { [HeaderConstants.CONTENT_TYPE]: "image/png" },
        );
    }

    return imageResponse;
}

function extractIdFromRequest(req: Request) {
    const { pathname } = new URL(req.url);

    const filename = pathname.split("/").reverse()[0];
    const id = filename.slice(0, filename.length - 4);

    return id;
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
