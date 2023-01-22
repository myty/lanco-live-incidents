import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs/promises";
import { load } from "cheerio";

export default async function (req: VercelRequest, res: VercelResponse) {
    const id = req.url!.split("/").reverse()[0].split("?")[0];
    const [host, proto] = [
        req.headers["x-forwarded-host"] as string,
        req.headers["x-forwarded-proto"] as string,
    ];

    const contents = await readIndexContents(host, proto);
    const $ = load(contents);

    $("head").append(`
        <meta property="og:title" content="Central Penn Incidents" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${proto}://${host}/incidents/${id}" />
        <meta property="og:image" content="${proto}://${host}/og-images/${id}.png" />
    `);

    res.send($.html());
}

async function readIndexContents(host: string, proto: string) {
    if (process.env.VERCEL_ENV !== "development") {
        return await fs.readFile("./index.html", { encoding: "utf-8" });
    }

    const pageResponse = await fetch(`${proto}://${host}/`);
    return pageResponse.text();
}
