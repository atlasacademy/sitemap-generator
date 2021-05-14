import {ApiConnector, Region} from "@atlasacademy/api-connector";
import {EnumChangefreq, SitemapItemLoose} from "sitemap";
import generateSitemapItem from "./generateSitemapItem";

export default async function (region: Region): Promise<SitemapItemLoose[]> {
    const connector = new ApiConnector({region}),
        wars = await connector.warList(),
        items: SitemapItemLoose[] = [];

    items.push(await generateSitemapItem(
        `/db/${region}/wars`,
        EnumChangefreq.DAILY,
        wars
    ));

    for (let i in wars) {
        const war = wars[i],
            base = `/db/${region}/war/${war.id}`;

        console.log(`WAR: ${war.id}`);

        items.push(await generateSitemapItem(base, EnumChangefreq.DAILY, war));
    }

    return items;
}
