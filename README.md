# RFS Bundle Scraper

This has turned into a script that will not only scrap IG bundles, but will also scrape Humble Bundle. All of the information is then printed neatly in JSON for your own consumption.

I use it specifically for a game database to organize all the bundles I own.


### How to use
Instructions have changed new instructions coming soon.

#### History

Since I found out about IndieGala I have loved the idea and have put in quite a bit of money towards the charities and publishers of these great games they offer.

I have multiple copies of each bundle and found myself wanting to easily retrieve all the keys and download links of the games and music that are available from some of the bundles.

I wrote this bookmarklet to add a text box and a tab delimited list of all the games, music, drm free games, and android games of the bundle on the current page.

I am releasing this to the public in the hopes that it will be useful to others. Also, if IndieGala or HumbleBundle changes up their code I hope to have some help updating the code once in a while. I just updated it to their latest changes (May '14).

### To Do

* Integrate the Humble Bundle code and detect which site you're on.

### Known Issues

* ~~On the android games list the very first game has a list of all the subsequent game names for some reason~~
* the `rfsbundle` object will be an array of all bundles, but because localStorage doesn't cross domains it'll have to always be separate.
* ~~`games.game[i].title_slug` is not being saved for some reason despite line 200. `games.game[i].title` is saved properly but `title_slug` is not.~~

### More Info

If you like what I am doing and would like to contribute please feel free to fork and send a pull request.
I would love to know how you found my repo and how you are using it. I also would be happy to share more
info on how I am creating the game database. I am using a Ruby on Rails backend with a JSON API and AngularJS
for the frontend.

## History

### 14Aug14 - v0.8140125

* Updated for changes to IG layout
* Supports both old (with steam key visible) and gift link url
* Auto clicks (with a setting to disable it) all gift links on a bundle page

### 13May14 - v0.1

Initial Release on GitHub