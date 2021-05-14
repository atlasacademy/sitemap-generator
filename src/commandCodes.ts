import {ApiConnector, Region} from "@atlasacademy/api-connector";
import {EnumChangefreq, SitemapItemLoose} from "sitemap";
import generateSitemapItem from "./generateSitemapItem";

export default async function (region: Region): Promise<SitemapItemLoose[]> {
    const connector = new ApiConnector({region}),
        commandCodes = await connector.commandCodeList(),
        items: SitemapItemLoose[] = [];

    items.push(await generateSitemapItem(
        `/db/${region}/command-codes`,
        EnumChangefreq.WEEKLY,
        commandCodes
    ));

    for (let i in commandCodes) {
        const commandCode = commandCodes[i],
            base = `/db/${region}/command-code/${commandCode.collectionNo}`;

        console.log(`CC: ${commandCode.collectionNo}`);

        items.push(await generateSitemapItem(base, EnumChangefreq.YEARLY, commandCode));
    }

    return items;
}
