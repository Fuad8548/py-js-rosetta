/**
 * Chapter 1: Foundations
 * Fetch one RSS feed and print the article titles.
 *
 * Same logic as the Python version, deliberately flat — no functions/classes yet.
 * Run with: node 01_fetch_one_feed.js
 * (requires a DOM-less XML parser like 'fast-xml-parser' — see package.json)
 */

const { XMLParser } = require("fast-xml-parser");

const FEED_URL = "https://www.prothomalo.com/feed"; // example Bangla news RSS feed

async function main() {
  const response = await fetch(FEED_URL);
  const xmlText = await response.text();

  const parser = new XMLParser();
  const data = parser.parse(xmlText);

  const items = data.rss.channel.item;

  for (const item of items) {
    console.log(item.title);
  }
}

main();
