import {ApiConnector, Region} from "@atlasacademy/api-connector";
import {EnumChangefreq, SitemapItemLoose} from "sitemap";
import generateSitemapItem from "./generateSitemapItem";

export default async function (region: Region): Promise<SitemapItemLoose[]> {
    const connector = new ApiConnector({region}),
        craftEssences = await connector.craftEssenceList(),
        items: SitemapItemLoose[] = [];

    items.push(await generateSitemapItem(
        `/db/${region}/craft-essences`,
        EnumChangefreq.WEEKLY,
        craftEssences
    ));

    for (let i in craftEssences) {
        const craftEssence = craftEssences[i],
            base = `/db/${region}/craft-essence/${craftEssence.collectionNo}`;

        console.log(`CE: ${craftEssence.collectionNo}`);

        items.push(await generateSitemapItem(base, EnumChangefreq.YEARLY, craftEssence));
        items.push(await generateSitemapItem(`${base}/profile`, EnumChangefreq.YEARLY, craftEssence));
        items.push(await generateSitemapItem(`${base}/assets`, EnumChangefreq.YEARLY, craftEssence));
    }

    return items;
}
