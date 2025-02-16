const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const page = req.query.page || 1;
    
    if (!query) {
        return res.status(400).json({ error: 'Missing search query parameter "q"' });
    }
    
    const searchUrl = `https://animetosho.org/search?filter%5B0%5D%5Bt%5D=nyaa_class&filter%5B0%5D%5Bv%5D=&order=date-a&disp=&q=${encodeURIComponent(query)}&page=${page}`;
    
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
                const text = $(linkElement).text().trim(); // Get the link text (e.g., "", "Magnet", "Nyaa")

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

const getSearch = async (req) => {
    let query = req.query.q;
    let page = parseInt(req.query.page) || 1; // Start with provided page or default to 1
    const maxSeasons = parseInt(req.query.maxSeasons) || 10;
    const maxEpisodes = parseInt(req.query.maxEpisodes) || 50;
    
    if (!query) {
        throw new Error('Missing search query parameter "q"');
    }

    let results = {};
    let hasNextPage = true; // Assume there is a next page

    while (hasNextPage) {
        const searchUrl = `https://animetosho.org/search?filter%5B0%5D%5Bt%5D=nyaa_class&filter%5B0%5D%5Bv%5D=&order=date-a&disp=&q=${encodeURIComponent(query)}&page=${page}`;

        try {
            const response = await axios.get(searchUrl);
            const html = response.data;
            const $ = cheerio.load(html);

            $('.home_list_entry.home_list_entry_alt, .home_list_entry, .home_list_entry_compl_1').each((index, element) => {
                const titleElement = $(element).find('.link a');
                const title = titleElement.text().trim();
                
                const links = [];
                $(element).find('.links a.dlink, .links a[href^="magnet:"]').each((_, linkElement) => {
                    const href = $(linkElement).attr('href');
                    const text = $(linkElement).text().trim();

                    links.push({
                        href,
                        text,
                        isMagnet: href && href.startsWith('magnet:')
                    });
                });

                // Regex to check for season and episode
                const match = title.match(/S(\d{2})E(\d{2})/i);
                if (match && links.length > 0) {
                    const season = parseInt(match[1]);
                    const episode = parseInt(match[2]);

                    // Apply user-defined filters
                    if (season <= maxSeasons && episode <= maxEpisodes) {
                        const key = `${query} S${match[1]}E${match[2]}`;
                        if (!results[key]) {
                            results[key] = [];
                        }
                        results[key].push(...links);
                    }
                }
            });

            // Check if there is a next page by looking for "Newer Entries" link
            hasNextPage = $('.home_list_pagination a').text().includes('Newer Entries');

            if (hasNextPage) {
                page++; // Increment page number
            }

        } catch (error) {
            console.error(`Error fetching data for page ${page}:`, error);
            throw new Error('An error occurred while fetching data');
        }
    }

    return results;
};

app.get('/episodes', async (req, res) => {
    try {
        const results = await getSearch(req);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// module.exports = app;
