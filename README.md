# This project is no longer maintained

# RFS Bundle Scraper

This has turned into a script that will not only scrap Indiegala bundles, but will also scrape Humble Bundle. All of the information is then printed neatly in JSON for your own consumption.

A companion website will be made available


### How to use
1. Copy `javascript: (function() {s = document.createElement('script');s.setAttribute('type', 'text/javascript');s.setAttribute('src', 'https://cdn.rawgit.com/realityfluxstudios/RFSBundleScraper/v1.1.1/rfsbundlescraper.js');document.body.appendChild(s); })();` into the
URL part of a bookmark.
2. When on the bundle page of either IndieGala or HumbleBundle, simply click the bookmark you just created.

A textbox will appear in the lower right side of the screen. This will contain the JSON data of the items in the
bundle.

There are a couple reasons why the JSON won't instantly appear in the textbox on the first try. If the bundle is one
of the newer ones that requires linking to Steam then you will need to click the `Auto Click` button above the
textbox. This will click all of the guest link images and create gift links so that they can be given out. Don't
worry, you can claim them for yourself as well later.

If you have multiple copies of the same bundle you can go to each successive page and run the script and it will
properly combine the serials/urls for the same item.

When going to a new bundle, be sure to hit the `Reset/Clear` button to clear the local storage data so the JSON will
be accurate based on the current bundle.

When all else fails, clear the localStorage `click reset/clear` and hit `reload` this removes the text area,
attaches the script (and supposed to remove the previous one) and re-runs the script on the page.

Indie Gala
==========

Nothing special for this site. It is pretty straight forward. Go to each gift url and click the RFS Bundle Scraper Bookmarklet. For multiple copies of a single bundle just go to the subsequent gift urls and open the bookmarklet
again. It will automatically combine the data properly.

IG's DRM free stuff is not protected in any way so the URLs are good forever. Guard these URLs because if they get out then
the developers are getting cheated if people just download their games without paying. They released their games DRM free
with the trust in their fans that they wouldn't betray their intellectual property rights.

**Note** There is currently no check to see if it is the correct bundle it's combining with, so in the case of a mistaken
combination, just clear the data and refresh the bookmarklet.

Humble Bundle
=============
With HumbleBundle it's pretty much the same thing. The main library page is ALL of the DRM free files. This can be scraped
as well and I will be using this data as a way to update all the URLs for the drm free stuff in the database. As it stands
right now (Sept 10) it will not detect duplicates. This same information is given within the individual bundles. I prefer
to get the information from the bundles first and then use the main library page to update the urls as needed (eventually).

_The rake tasks now detect entries already in the database and simply updates the HTTP and BT urls that expire after about a week.
And this is only required for the DRM free items, of course, which means everything listed on the main library page. So it is
my suggestion that you go through every single bundle you have, first, so you can get the bundle information on the DRM free
items and then, as needed, run the bookmarklet on the library page and then run the `rake import_hb` task again to update the
urls as needed._

Bundle Stars
============
Please see the [RFSBundleScraper Wiki](https://github.com/realityfluxstudios/RFSBundleScraper/wiki/BundleStars) for more
information on importing data from BundleStars.

### History

Since I found out about IndieGala I have loved the idea and have put in quite a bit of money towards the charities and publishers of these great games they offer.

I have multiple copies of each bundle and found myself wanting to easily retrieve all the keys and download links of the games and music that are available from some of the bundles.

I wrote this bookmarklet to add a text box and a tab delimited list of all the games, music, drm free games, and android games of the bundle on the current page.

I am releasing this to the public in the hopes that it will be useful to others. Also, if IndieGala or HumbleBundle changes up their code I hope to have some help updating the code once in a while. I just updated it to their latest changes (May '14).

### To Do
* submit one in the issues area! :)

### Known Issues
* submit one in the issues area! :)

### More Info

If you like what I am doing and would like to contribute please feel free to fork and send a pull request.
I would love to know how you found my repo and how you are using it. I also would be happy to share more
info on how I am creating the game database. I am using a Ruby on Rails backend with a JSON API and AngularJS
for the frontend.

## Change Log
(this is not a comprehensive list of changes)

### 30Aug14 - v0.8242206
* Everything is working well for both IndieGala and HumbleBundle.
* BundleStars is not automatically harvested. There are detailed instructions on how to retrieve the data from
BundleStars in the Wiki

### 19Aug14 - v0.8191640
* Integrating Humble Bundle code
* Cleaned up repo a lot to just be the bare essentials.
* Added css inline so bootstrap isn't required and it looks decent.

### 14Aug14 - v0.8140125

* Updated for changes to IG layout
* Supports both old (with steam key visible) and gift link url
* Auto clicks (with a setting to disable it) all gift links on a bundle page

### 13May14 - v0.1

Initial Release on GitHub
