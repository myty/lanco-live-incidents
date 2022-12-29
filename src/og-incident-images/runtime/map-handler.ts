import { Handler } from "https://deno.land/std@0.170.0/http/server.ts";

export interface FunctionHandler {
    [folder: string]: (request: Request) => Response | Promise<Response>;
}

export function mapHandler(functionsMap: FunctionHandler): Handler {
    return (req: Request) => {
        const requestUrl = new URL(req.url);
        const { pathname } = requestUrl;

        const foundFunctions = Object.keys(functionsMap)
            .filter((key) => pathname.startsWith(`/api/${key}`))
            .map((key) => functionsMap[key]);

        const foundFunction = foundFunctions.length < 1
            ? undefined
            : foundFunctions[0];

        if (foundFunction != null) {
            return foundFunction(req);
        }

        return new Response(null, { status: 404 });
    };
}
