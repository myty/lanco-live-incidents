import * as React from "react";
import { ImageResponse } from "@vercel/og";
import { IncidentServiceFactory } from "./incident-service.ts";
import { ResponseCache } from "../cache/response-cache.ts";

const incidentService = IncidentServiceFactory.create();
const internalCache = new ResponseCache({ expirationMs: 1000 * 60 * 60 });

export default async function handler(req: Request): Promise<Response> {
  const id = extractIdFromRequest(req);

  if (id == null) {
    return new Response(null, { status: 500 });
  }

  const blockBlobName = `${id}.png`;

  const cachedImageResponse = internalCache.get(blockBlobName);
  if (cachedImageResponse != null) {
    return cachedImageResponse.clone();
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

  if (incident != null) {
    internalCache.set(blockBlobName, imageResponse.clone());
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
