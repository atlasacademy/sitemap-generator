import dotenv from "dotenv";
dotenv.config();

import {Region} from "@atlasacademy/api-connector";
import {writeFileSync} from "fs";
import {EnumChangefreq, SitemapItemLoose, SitemapStream, streamToPromise} from "sitemap";
import {Readable} from "stream";
import changes from "./changes";
import commandCodes from "./commandCodes";
import craftEssences from "./craftEssences";
import database from "./database";
import events from "./events";
import generateSitemapItem from "./generateSitemapItem";
import items from "./items";
import mysticCodes from "./mysticCodes";
import servants from "./servants";
import wars from "./wars";

const links: SitemapItemLoose[] = [],
    regions = [Region.JP, Region.NA];

(async () => {
    console.log(`HOME ...`);
    links.push(await generateSitemapItem('/db/', EnumChangefreq.NEVER, null));

    for (let i in regions) {
        const region = regions[i];

        console.log(`${region} SERVANTS ...`);
        links.push(...await servants(region));
        console.log(`${region} CEs ...`);
        links.push(...await craftEssences(region));
        console.log(`${region} CCs ...`);
        links.push(...await commandCodes(region));
        console.log(`${region} MCs ...`);
        links.push(...await mysticCodes(region));
        console.log(`${region} ITEMS ...`);
        links.push(...await items(region));
        console.log(`${region} EVENTS ...`);
        links.push(...await events(region));
        console.log(`${region} WARS ...`);
        links.push(...await wars(region));
        console.log(`${region} CHANGES ...`);
        links.push(...await changes(region));
    }

    const stream = new SitemapStream({hostname: 'https://apps.atlasacademy.io'}),
        xml = (await streamToPromise(Readable.from(links).pipe(stream))).toString();

    writeFileSync('./output/sitemap.xml', xml);

    database.destroy();

    return;
})().then(() => {
    console.log("COMPLETE");
})
