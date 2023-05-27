import { serve } from "../deps.ts";
import { getPort } from "./get-port.ts";
import { FunctionHandler, mapHandler } from "./map-handler.ts";

export const serveFunctions = (functionsMap: FunctionHandler) =>
    serve(mapHandler(functionsMap), { port: getPort() });
