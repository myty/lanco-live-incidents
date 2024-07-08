import ogImageHandler from "./og-images/handler.tsx";
import { Hono } from "@hono/hono";
import { getPort } from "./runtime/get-port.ts";

const app = new Hono();
app.get("/*.png", (c) => ogImageHandler(c.req.raw));

Deno.serve({ port: getPort() }, app.fetch);
