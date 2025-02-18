# Anime Search API 

This is a simple API that scrapes data from [animetosho.org](https://animetosho.org/) to provide search results for anime releases.  It's built using Node.js with Express, Axios, Cheerio, and CORS.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Disclaimer](#disclaimer)

## Features

*   **Search**: Searches animetosho.org based on a query parameter.
*   **Returns**: Returns a JSON array of search results, each containing the title and an array of available links (torrents, magnet links, etc.).  Each link includes the URL, the link text (e.g., "Torrent", "Magnet"), and a boolean flag indicating if it's a magnet link.
*   **Error Handling**: Includes basic error handling to catch issues with the web scraping or request processing.
*   **CORS Enabled**:  CORS is enabled to allow cross-origin requests.

## Technologies Used

*   **Node.js**: JavaScript runtime environment.
*   **Express**: Web framework for Node.js.
*   **Axios**: HTTP client for making requests to external websites.
*   **Cheerio**: Library for parsing HTML.
*   **CORS**: Middleware for enabling Cross-Origin Resource Sharing.

## API Endpoints

The API endpoint are: 

*   `/search`:  Basic search endpoint (returns results from a single page).
*   `/episodes`:  Enhanced search endpoint with pagination and season/episode filtering.

The API is deployed at: `https://anime-backend-psi.vercel.app/` _In case of a gateway timeout use:_`https://animebackend-production.up.railway.app/`

## Usage

### `/search` Endpoint

To use the basic search endpoint, make a GET request to `/search` with a query parameter `q` and page parameter `page` (defaults to 1):
```sh
https://anime-backend-psi.vercel.app/search?q=your_search_query&page=1
```

Replace `your_search_query` with the anime title or keywords you're searching for. The query will be URL-encoded automatically by the browser.

### `/episodes` Endpoint

To use the enhanced search endpoint, make a GET request to `/episodes` with a query parameter `q`:
```sh
https://anime-backend-psi.vercel.app/episodes?q=your_search_query&maxSeasons=10&maxEpisodes=50
```
*   `q`: The search query (required).
*   `page`: The page number to retrieve (optional, defaults to 1).
*   `maxSeasons`: The maximum season number to include in the results (optional, defaults to 10).
*   `maxEpisodes`: The maximum episode number to include in the results (optional, defaults to 50).

### `/search` Example

```json
[
  {
    "title": "[SubsPlease] Jujutsu Kaisen 0 - Movie [1080p] [Multi-Subs]",
    "links": [
      {
        "href": "magnet:?xt=urn:btih:some_magnet_hash",
        "text": "Magnet",
        "isMagnet": true
      }
    ]
  },
  // ... more results
]
```

### `/episodes` Example

```json
{
  "Jujutsu Kaisen S01E01": [
    {
      "href": "magnet:?xt=urn:btih:magnet_hash_1",
      "text": "Magnet",
      "isMagnet": true
    },
    // ... other links for S01E01
  ],
  "Jujutsu Kaisen S01E02": [
    {
      "href": "magnet:?xt=urn:btih:magnet_hash_2",
      "text": "Magnet",
      "isMagnet": true
    },
    // ... other links for S01E02
  ],
  // ... more episodes
}
```
### Disclaimer

This API scrapes data from animetosho.org. The maintainer of this API are not responsible for the content of the search results. Web scraping is a fragile process. Website structure can change, which may break the scraper. I will try to keep it updated, but no guarantee is provided.
