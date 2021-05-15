import hash from "object-hash";
import {EnumChangefreq, SitemapItemLoose} from "sitemap";
import database from "./database";

function formatDate(date: Date): string {
    const pad = (value: number, length: number): string => {
            return value.toString().padStart(length, '0');
        },
        year = pad(date.getFullYear(), 4),
        month = pad(date.getMonth()+1, 2),
        day = pad(date.getDate(), 2),
        hour = pad(date.getHours(), 2),
        minute = pad(date.getMinutes(), 2),
        second = pad(date.getSeconds(), 2);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function query(sql: string, values: string[]): Promise<any[]> {
    return new Promise<any[]>(resolve => {
        database.query(sql, values, function (err, results, fields) {
            resolve(results);
        });
    });
}

export default async function (url: string, freq: EnumChangefreq, payload?: any): Promise<SitemapItemLoose> {
    const hashValue = hash(payload ?? {}),
        results = await query('SELECT * FROM items WHERE url = ?', [url]);

    let lastModified:Date;

    if (!results.length) {
        const now = new Date();

        await query(
            'INSERT INTO items SET url = ?, hash = ?, lastModified = ?',
            [url, hashValue, formatDate(now)]
        );

        lastModified = now;
    } else if (hashValue !== results[0].hash) {
        const now = new Date();

        await query(
            'UPDATE items SET hash = ?, lastModified = ? WHERE url = ?',
            [hashValue, formatDate(now), url]
        );

        lastModified = now;
    } else {
        lastModified = results[0].lastModified;
    }

    return {
        url, changefreq: freq, lastmod: lastModified.toISOString()
    };
}
