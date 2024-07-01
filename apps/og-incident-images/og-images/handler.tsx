import * as React from "react";
import { ImageResponse } from "@vercel/og";
import { BlobContainerRestProvider } from "../azure-blob-storage/blob-container-rest-provider.ts";
import { HeaderConstants } from "@azure/storage-blob/constants";
import { IncidentServiceFactory } from "./incident-service.ts";

const BLOB_CACHE_ENABLED = false;

const blobContainerProvider = BlobContainerRestProvider.create({
  container: "og-images",
});

const incidentService = IncidentServiceFactory.create();

export default async function handler(req: Request): Promise<Response> {
  const id = extractIdFromRequest(req);

  if (id == null) {
    return new Response(null, { status: 500 });
  }

  const blockBlobName = `${id}.png`;

  if (BLOB_CACHE_ENABLED) {
    await blobContainerProvider.createIfNotExists();
    const foundBlob = await blobContainerProvider.getBlockBlob(blockBlobName);
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

  const [filename] = pathname.split("/").reverse();

  if (filename == null || !filename.endsWith(".png")) {
    return undefined;
  }

  return filename.slice(0, filename.length - 4);
}
