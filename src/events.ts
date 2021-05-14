import {ApiConnector, Region} from "@atlasacademy/api-connector";
import {EnumChangefreq, SitemapItemLoose} from "sitemap";
import generateSitemapItem from "./generateSitemapItem";

export default async function (region: Region): Promise<SitemapItemLoose[]> {
    const connector = new ApiConnector({region}),
        events = await connector.eventList(),
        items: SitemapItemLoose[] = [];

    items.push(await generateSitemapItem(
        `/db/${region}/events`,
        EnumChangefreq.WEEKLY,
        events
    ));

    for (let i in events) {
        const event = events[i],
            base = `/db/${region}/event/${event.id}`;

        console.log(`EVENT: ${event.id}`);

        items.push(await generateSitemapItem(base, EnumChangefreq.YEARLY, event));
    }

    return items;
}
