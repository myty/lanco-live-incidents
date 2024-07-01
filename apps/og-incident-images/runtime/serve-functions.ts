import { getPort } from "./get-port.ts";
import { FunctionHandler, mapHandler } from "./map-handler.ts";

export const serveFunctions = (functionsMap: FunctionHandler) =>
  Deno.serve({ port: getPort() }, mapHandler(functionsMap));
