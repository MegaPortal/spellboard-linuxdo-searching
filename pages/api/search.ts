import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query.term;

    if (!query) {
        res.status(400).json({ message: 'Missing query parameter' });
        return;
    }

    const resp = await fetch(`https://linux.do/search/query?term=${query}`, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "discourse-present": "true",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "x-csrf-token": "undefined",
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://linux.do/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });

    const data = await resp.json();

    res.status(200).json(data);
}