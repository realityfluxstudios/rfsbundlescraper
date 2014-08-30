# RFS Bundle Scraper

This has turned into a script that will not only scrap Indiegala bundles, but will also scrape Humble Bundle. All of the information is then printed neatly in JSON for your own consumption.

A companion website will be made available


### How to use
1. Copy `javascript: (function() {s = document.createElement('script');s.setAttribute('type', 'text/javascript');s.setAttribute('src', 'https://raw.githack.com/realityfluxstudios/RFSBundleScraper/master/rfsbundlescraper.js');document.body.appendChild(s); })();` into the
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

#### History

Since I found out about IndieGala I have loved the idea and have put in quite a bit of money towards the charities and publishers of these great games they offer.

I have multiple copies of each bundle and found myself wanting to easily retrieve all the keys and download links of the games and music that are available from some of the bundles.

I wrote this bookmarklet to add a text box and a tab delimited list of all the games, music, drm free games, and android games of the bundle on the current page.

I am releasing this to the public in the hopes that it will be useful to others. Also, if IndieGala or HumbleBundle changes up their code I hope to have some help updating the code once in a while. I just updated it to their latest changes (May '14).

### To Do

* ~~Integrate the Humble Bundle code and detect which site you're on. (**IN PROGRESS**)~~ (**DONE**)

### Known Issues

* ~~On the android games list the very first game has a list of all the subsequent game names for some reason~~
* ~~`games.game[i].title_slug` is not being saved for some reason despite line 200. `games.game[i].title` is saved properly but `title_slug` is not.~~
* ~~ the `rfsbundle` object will be an array of all bundles, but because localStorage doesn't cross domains it'll have to always be separate.~~

### More Info

If you like what I am doing and would like to contribute please feel free to fork and send a pull request.
I would love to know how you found my repo and how you are using it. I also would be happy to share more
info on how I am creating the game database. I am using a Ruby on Rails backend with a JSON API and AngularJS
for the frontend.

## History
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