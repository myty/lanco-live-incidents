export function getPort(portFallback = 80): number {
  const port = Number.parseInt(
    Deno.env.get("APP_PORT") ?? "NaN",
  );

  return Number.isNaN(port) ? portFallback : port;
}
