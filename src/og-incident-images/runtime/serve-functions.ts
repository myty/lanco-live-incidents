import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { getPort } from "./get-port.ts";
import { FunctionHandler, mapHandler } from "./map-handler.ts";

export const serveFunctions = (functionsMap: FunctionHandler) =>
    serve(mapHandler(functionsMap), { port: getPort() });
