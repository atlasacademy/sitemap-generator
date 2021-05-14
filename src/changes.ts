import {ApiConnector, Region} from "@atlasacademy/api-connector";
import {EnumChangefreq, SitemapItemLoose} from "sitemap";
import generateSitemapItem from "./generateSitemapItem";

export default async function (region: Region): Promise<SitemapItemLoose[]> {
    const connector = new ApiConnector({region}),
        changes = await connector.changelog(),
        items: SitemapItemLoose[] = [];

    items.push(await generateSitemapItem(
        `/db/${region}/changes`,
        EnumChangefreq.HOURLY,
        changes
    ));

    return items;
}
