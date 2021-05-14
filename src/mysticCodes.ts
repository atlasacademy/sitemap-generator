import {ApiConnector, Region} from "@atlasacademy/api-connector";
import {EnumChangefreq, SitemapItemLoose} from "sitemap";
import generateSitemapItem from "./generateSitemapItem";

export default async function (region: Region): Promise<SitemapItemLoose[]> {
    const connector = new ApiConnector({region}),
        mysticCodes = await connector.mysticCodeList(),
        items: SitemapItemLoose[] = [];

    items.push(await generateSitemapItem(
        `/db/${region}/mystic-codes`,
        EnumChangefreq.WEEKLY,
        mysticCodes
    ));

    for (let i in mysticCodes) {
        const mysticCode = mysticCodes[i],
            base = `/db/${region}/mystic-code/${mysticCode.id}`;

        console.log(`MC: ${mysticCode.id}`);

        items.push(await generateSitemapItem(base, EnumChangefreq.YEARLY, mysticCode));
        items.push(await generateSitemapItem(`${base}/skill-1`, EnumChangefreq.YEARLY, mysticCode));
        items.push(await generateSitemapItem(`${base}/skill-2`, EnumChangefreq.YEARLY, mysticCode));
        items.push(await generateSitemapItem(`${base}/skill-3`, EnumChangefreq.YEARLY, mysticCode));
    }

    return items;
}
