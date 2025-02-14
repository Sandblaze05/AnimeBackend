const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Missing search query parameter "q"' });
    }

    const searchUrl = `https://animetosho.org/search?filter%5B0%5D%5Bt%5D=nyaa_class&filter%5B0%5D%5Bv%5D=&order=date-a&disp=&q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(searchUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        const results = [];

        $('.home_list_entry.home_list_entry_alt, .home_list_entry, .home_list_entry_compl_1').each((index, element) => {
            const titleElement = $(element).find('.link a');
            const title = titleElement.text().trim();

            const links = []; // Array to store all links for this entry

            $(element).find('.links a.dlink, .links a[href^="magnet:"]').each((linkIndex, linkElement) => { // Iterate over all <a> in .links
                const href = $(linkElement).attr('href');
                const text = $(linkElement).text().trim(); // Get the link text (e.g., "Torrent", "Magnet", "Nyaa")

                links.push({
                    href: href,
                    text: text, // Add the link text
                    isMagnet: href && href.startsWith('magnet:') // flag if magnet link
                });
            });

            if (title && links.length > 0) { // Only add if title and at least one link exist
                results.push({
                    title: title,
                    links: links, // Store all links in the 'links' array
                });
            }
        });

        res.json(results);

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });

module.exports = app;