export function getPort(portFallback = 8080): number {
    const port = Number.parseInt(
        Deno.env.get("FUNCTIONS_CUSTOMHANDLER_PORT") ?? "NaN",
    );

    return Number.isNaN(port) ? portFallback : port;
}
