import {ApiConnector, Region} from "@atlasacademy/api-connector";
import {EnumChangefreq, SitemapItemLoose} from "sitemap";
import generateSitemapItem from "./generateSitemapItem";

export default async function (region: Region): Promise<SitemapItemLoose[]> {
    const connector = new ApiConnector({region}),
        servants = await connector.servantListNice(),
        items: SitemapItemLoose[] = [];

    items.push(await generateSitemapItem(
        `/db/${region}/servants`,
        EnumChangefreq.WEEKLY,
        servants
    ));

    for (let i in servants) {
        const servant = servants[i],
            base = `/db/${region}/servant/${servant.collectionNo}`;

        console.log(`SERVANT: ${servant.collectionNo}`);

        items.push(await generateSitemapItem(base, EnumChangefreq.YEARLY, servant));

        for (let j = 1; j <= 3; j++) {
            if (servant.skills.filter(skill => skill.num === j).length > 0)
                items.push(await generateSitemapItem(
                    `${base}/skill-${j}`,
                    EnumChangefreq.YEARLY,
                    servant.skills.filter(skill => skill.num === j)
                ));
        }

        if (servant.noblePhantasms.filter(noblePhantasm => noblePhantasm.functions.length > 0).length > 0)
            items.push(await generateSitemapItem(
                `${base}/noble-phantasms`,
                EnumChangefreq.YEARLY,
                servant.noblePhantasms.filter(noblePhantasm => noblePhantasm.functions.length > 0)
            ));

        if (servant.classPassive.length > 0)
            items.push(await generateSitemapItem(
                `${base}/passives`,
                EnumChangefreq.YEARLY,
                servant.classPassive
            ));

        items.push(await generateSitemapItem(
            `${base}/lore`,
            EnumChangefreq.YEARLY,
            servant.profile?.comments
        ));

        items.push(await generateSitemapItem(
            `${base}/assets`,
            EnumChangefreq.YEARLY,
            servant.extraAssets
        ));

        items.push(await generateSitemapItem(
            `${base}/voices`,
            EnumChangefreq.YEARLY,
            servant.profile?.voices
        ));
    }

    return items;
};
