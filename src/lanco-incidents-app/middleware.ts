import { next, rewrite } from "@vercel/edge";

export const config = {
    matcher: ["/share/:id", "/og-images/:match*", "/api/incidents/:match*"],
};

export default function middleware(request: Request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/share")) {
        return rewriteShareUrl(url);
    }

    if (url.pathname.startsWith("/og-images")) {
        return rewriteOgImagesUrl(url);
    }

    if (url.pathname.startsWith("/api/incidents")) {
        return rewriteIncidentsApiUrl(url);
    }

    return next();
}

function rewriteOgImagesUrl(url: URL) {
    return rewrite(new URL(url.pathname, process.env.OG_IMAGES_API));
}

function rewriteIncidentsApiUrl(url: URL) {
    return rewrite(new URL(url.pathname, process.env.INCIDENTS_API));
}

function rewriteShareUrl(url: URL) {
    const id = extractLastSegmentOfUrlPath(url);
    url.pathname = `/api/share/${id}`;

    return rewrite(url);
}

function extractLastSegmentOfUrlPath(url: URL): string {
    const { pathname } = url;
    return pathname.split("/").reverse()[0];
}
