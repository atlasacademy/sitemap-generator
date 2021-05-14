import {ApiConnector, Region} from "@atlasacademy/api-connector";
import {EnumChangefreq, SitemapItemLoose} from "sitemap";
import generateSitemapItem from "./generateSitemapItem";

export default async function (region: Region): Promise<SitemapItemLoose[]> {
    const connector = new ApiConnector({region}),
        items = await connector.itemList(),
        links: SitemapItemLoose[] = [];

    links.push(await generateSitemapItem(
        `/db/${region}/items`,
        EnumChangefreq.WEEKLY,
        items
    ));

    for (let i in items) {
        const item = items[i],
            base = `/db/${region}/item/${item.id}`;

        console.log(`ITEM: ${item.id}`);

        links.push(await generateSitemapItem(base, EnumChangefreq.YEARLY, item));
    }

    return links;
}
