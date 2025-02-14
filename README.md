# Anime Search API

This is a simple API that scrapes data from [animetosho.org](https://animetosho.org/) to provide search results for anime releases.  It's built using Node.js with Express, Axios, Cheerio, and CORS.

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

## API Endpoint

The API endpoint is: `https://anime-backend-psi.vercel.app/search`

## Usage

To use the API, make a GET request to the endpoint with a query parameter `q`:
