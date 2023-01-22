import { Handler } from "https://deno.land/std@0.173.0/http/server.ts";

export interface FunctionHandler {
    [folder: string]: (request: Request) => Response | Promise<Response>;
}

export function mapHandler(functionsMap: FunctionHandler): Handler {
    return (req: Request) => {
        const { pathname } = new URL(req.url);

        const handler = findFunctionHandler(functionsMap, pathname);

        return handler != null
            ? handler(req)
            : new Response(null, { status: 404 });
    };
}

function findFunctionHandler(functionsMap: FunctionHandler, pathname: string) {
    const foundFunctions = Object.keys(functionsMap)
        .filter((key) => pathname.startsWith(key))
        .map((key) => functionsMap[key]);

    return foundFunctions.length < 1 ? undefined : foundFunctions[0];
}
