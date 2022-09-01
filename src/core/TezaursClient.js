import https from 'https'
import jsdom from 'jsdom'
const { JSDOM } = jsdom;

/**
 * Tezaurs.lv API client
 * 
 */
export default class TezaursClient {

    constructor() {
        this.host = "tezaurs.lv";
    }

    /**
     * Retrieve homonyms and senses for provided word
     * 
     */
    async retrieve(word) {
        const path = `/api/retrieveEntry?hw=${encodeURIComponent(word)}`;

        let content = await this.#request(path);

        return this
            .#parseEntries(content);
    }

    /**
     * Parse HTML response and 
     * extract all homonyms and word senses
     * 
     */
    #parseEntries(content) {
        const dom = new JSDOM(content);

        const nodes = dom.window
            .document.querySelectorAll(".doc");

        if (nodes.length === 0)
            return null;

        let entries = {};
        let hom = 1;

        for (let node of nodes) {
            let subNodes = node
                .querySelectorAll(".sv_NO");

            if (subNodes.length === 0)
                continue;

            let senses = [];

            for (let subNode of subNodes) {
                senses.push(subNode.textContent.trim());
            }

            entries[hom++] = senses;
        }

        return entries;
    }

    /**
     * Perform HTTPS request
     * 
     */
    async #request(path) {
        const options = {
            host: this.host,
            path: path
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                res.setEncoding('utf8');
                let data = '';

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    resolve(data);
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            req.end();
        });
    }
}
