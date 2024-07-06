import * as React from "react";
import { ImageResponse } from "@vercel/og";
import { IncidentServiceFactory } from "./incident-service.ts";
import { BlobServiceClient } from "@azure/storage-blob";
import { BlobSASPermissions } from "@azure/storage-blob";
import { BlockBlobClient } from "@azure/storage-blob";

const connStr = Deno.env.get("AZURE_STORAGE_CONNECTION_STRING")!;
const BLOB_CACHE_ENABLED = Deno.env.get("BLOB_CACHE_ENABLED") === "true";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const incidentService = IncidentServiceFactory.create();

export default async function handler(req: Request): Promise<Response> {
  const id = extractIdFromRequest(req);

  if (id == null) {
    return new Response(null, { status: 500 });
  }

  const blockBlobName = `${id}.png`;

  let blobClient: BlockBlobClient | undefined;

  if (BLOB_CACHE_ENABLED) {
    const containerClient = blobServiceClient.getContainerClient("og-images");
    await containerClient.createIfNotExists();

    blobClient = containerClient.getBlockBlobClient(blockBlobName);

    const url = await blobClient.generateSasUrl({
      permissions: BlobSASPermissions.parse("r"),
      expiresOn: new Date(Date.now() + 60 * 60 * 1000),
    });

    const foundBlob = await fetch(url);
    if (foundBlob.ok) {
      return foundBlob;
    }
  }

  const incident = await incidentService.getIncident(id);

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
          {incident?.type ?? "Central Penn Incident"}
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

    const contentLength = parseInt(
      clonedResponse.headers.get("Content-Length") ?? "0",
      10,
    );

    await blobClient?.upload(clonedResponse.body, contentLength, {
      blobHTTPHeaders: {
        blobContentType: "image/png",
      },
    });
  }

  return imageResponse;
}

function extractIdFromRequest(req: Request) {
  const { pathname } = new URL(req.url);

  const [filename] = pathname.split("/").reverse();

  if (filename == null || !filename.endsWith(".png")) {
    return undefined;
  }

  return filename.slice(0, filename.length - 4);
}
