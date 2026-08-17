"""
Chapter 1: Foundations
Fetch one RSS feed and print the article titles.

This is deliberately simple — no functions, no classes yet.
We'll refactor this exact logic using FP (Ch3) and OOP (Ch4) later,
so notice how it feels to write it "flat" first.
"""

import urllib.request
import xml.etree.ElementTree as ET

FEED_URL = "https://www.prothomalo.com/feed"  # example Bangla news RSS feed

response = urllib.request.urlopen(FEED_URL)
xml_data = response.read()

root = ET.fromstring(xml_data)

# RSS structure: rss > channel > item > title
for item in root.findall("./channel/item"):
    title = item.find("title").text
    print(title)
