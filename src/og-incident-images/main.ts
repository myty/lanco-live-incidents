import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import ogImageHandler from "./og-images/handler.tsx";

serve(
    (req) => {
        const requestUrl = new URL(req.url);
        const { pathname } = requestUrl;

        if (pathname.startsWith("/api/og-images")) {
            return ogImageHandler(req);
        }

        return new Response(null, { status: 404 });
    },
    { port: getPort() },
);

function getPort(portFallback = 8080): number {
    const port = Number.parseInt(
        Deno.env.get("FUNCTIONS_CUSTOMHANDLER_PORT") ?? "NaN",
    );

    if (Number.isNaN(port)) {
        return portFallback;
    }

    return port;
}
