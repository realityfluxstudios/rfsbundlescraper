var VERSION = '0.8301100';

var rfsbundlescraper = {

  combine: false,
  exists: false,
  debug: true,
  bundle: {
    title: '',
    title_slug: '',
    site: '',
    games: []
  },

  run: function () {

    this.utils.detect_site();

    if (this.utils.site.indiegala)
      this.indiegala.ig_run();
    else if (this.utils.site.humblebundle)
      this.humblebundle.hb_run();
  },

  rerun: function () {
    this.utils.clearText();

    this.run();
  },

  utils: {
    json_names: {
      humblebundle: 'rfshbbundle',
      indiegala: 'rfsigbundle'
    },
    href: window.location.href,
    site: {
      indiegala: false,
      humblebundle: false
    },
    interval: 0,
    ig_giftLinks: $('#icon-gift img'),
    hb_giftLinks: $('#steam-tab img'),
    hb_interval: 0,
    cacheBuster: 0,
    oldCacheBuster: 0,
    firstReload: true,
    rfsSettingsTextHeight: 400,
    rfsSettingsTextWidth: 315,

    appendText: function (value) {
      $('#rfs-games-list').val($('#rfs-games-list').val() + value);
    },

    clearText: function () {
      $('#rfs-games-list').val('');
    },

    add_floating_textarea: function () {
      $('body').append('<div id="rfs-container" style="position:fixed;bottom:10px;right:10px;z-index:1000;">\n    <div id="rfsSettings" style="color:#f5f5f5;background: black; display:none">\n        Height: <input onBlur="rfsbundlescraper.utils.updateSettings()" type="text" id="rfsSettingsTextHeight" style="width:50px" value="408">\n        Width: <input onBlur="rfsbundlescraper.utils.updateSettings()" type="text" id="rfsSettingsTextWidth" style="width:50px" value="415">\n        Secondary: <input type="checkbox" id="secondaryItems" name="secondaryItems" value="secondary">\n        Tertiary: <input type="checkbox" id="tertiaryItems" name="tertiaryItems" value="tertiary">\n    </div>\n    <button onClick="rfsbundlescraper.utils.toggleSettingsDisplay()" id="rfsSettingsBtn" class="btn-info">Settings</button>\n    <button style="color: #fff;background-color: #f0ad4e;border-color: #eea236;" onClick="rfsbundlescraper.utils.reloadScript();">Reload</button>\n    <button style="color: #fff;background-color: #f0ad4e;border-color: #eea236;" onClick="rfsbundlescraper.rerun();">Run</button>\n  <button style="color: #333;background-color: #fff;border-color: #ccc;" onClick="rfsbundlescraper.utils.autoClickButton();" id="ig_autoclick_btn">Auto \n      Click</button>\n    <button style="color: #fff; float: right !important;background-color: #d9534f;border-color: #d43f3a;" onClick="rfsbundlescraper.utils.close();">X</button>\n    <button style="color: #fff; float: right !important;background-color: #d9534f;border-color: #d43f3a;" onClick="rfsbundlescraper.utils.resetAndClear();">Reset/Clear</button>\n     <br />\n    <div id="rfsbundlescraper-version" style="font-weight: bolder; position:fixed;bottom: 3px;z-index:1500;width: 422px;-webkit-user-select: none;right: 10px; background:black; color:white; text-align:center">\n        RFS Bundle Scraper Bookmarklet v' + VERSION + '\n    </div><textarea onClick="this.select()" id="rfs-games-list" spellcheck="false" style="width: 415px; height: 408px !important; margin-bottom: 10px;"></textarea> \n    \n</div>');
    },

    detect_site: function () {
      if (this.href.match(/indiegala/)) {
        this.site.indiegala = true;
      }
      else if (this.href.match(/humblebundle/)) {
        this.site.humblebundle = true;
      }
    },

    autoClickButton: function () {
      if (this.site.indiegala)
        rfsbundlescraper.indiegala.clickGiftImages();
      else if (this.site.humblebundle)
        rfsbundlescraper.humblebundle.clickGiftImages();
    },

    toggleSettingsDisplay: function () {
      $('div#rfsSettings').toggle();
    },

    updateSettings: function () {
      var textHeight = $('#rfsSettingsTextHeight');
      var textWidth = $('#rfsSettingsTextWidth');
      var textArea = $('#rfs-games-list');

      localStorage.setItem('rfsSettingsTextHeight', textHeight.val());
      localStorage.setItem('rfsSettingsTextWidth', textWidth.val());

      var cssString = "height: " + textHeight.val() + "px !important; width: " + textWidth.val() + "px !important";

      textArea.css('cssText', cssString);
    },

    loadSettings: function () {
      if (localStorage.getItem('rfsSettingsTextHeight') != null) {
        $('#rfsSettingsTextHeight').val(localStorage.getItem('rfsSettingsTextHeight'));
        $('#rfsSettingsTextWidth').val(localStorage.getItem('rfsSettingsTextWidth'));
      }
      else {
        var textHeight = $('#rfsSettingsTextHeight');
        var textWidth = $('#rfsSettingsTextWidth');
        var textArea = $('#rfs-games-list');

        textArea.height(textHeight.val());
        textArea.width(textWidth.val());
      }
    },

    reloadScript: function () {
      var src = "https://rawgit.com/realityfluxstudios/RFSBundleScraper/master/rfsbundlescraper.js";

      $('#rfs-container').remove();

      if (this.firstReload) {
        this.cacheBuster = Date.now().toString();

        $('script[src="' + src + '"]').remove();
        $('<script>').attr('src', src + "?" + this.cacheBuster).appendTo('body');
        this.oldCacheBuster = this.cacheBuster;

        this.firstReload = false;
      } else {
        this.cacheBuster = Date.now().toString();
        $('script[src="' + src + '?' + this.oldCacheBuster + '"]').remove();
        $('<script>').attr('src', src + "?" + this.cacheBuster).appendTo('body');
        this.oldCacheBuster = this.cacheBuster;
      }

      this.updateSettings();
    },

    saveToLS: function (bundle) {
      localStorage.setItem(bundle, JSON.stringify(rfsbundlescraper.bundle, null, 2));

      $('#rfs-games-list').val(JSON.stringify(rfsbundlescraper.bundle, null, 2));
    },

    removeFromLS: function () {
      localStorage.removeItem(rfsbundlescraper.utils.json_names.indiegala);
      localStorage.removeItem(rfsbundlescraper.utils.json_names.humblebundle);

      localStorage.removeItem('rfsSettingsTextHeight');
      localStorage.removeItem('rfsSettingsTextWidth');

      rfsbundlescraper.bundle = {};
      this.appendText("Local Storage Cleared");
    },

    resetAndClear: function () {
      this.combine = false;
      this.exists = false;
      this.debug = true;
      this.removeFromLS();
      this.clearText();
      this.appendText('Local Storage cleared')
    },

    close: function () {
      $('#rfs-container').remove();
    },

    convertToSlug: function (value) {
      return value.toLowerCase()
        .replace(/-+/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-');
    },

    removeDupes: function (list) {
      console.log('removing dupes from : ');
      console.log(list);

      var unique = [];
      $.each(list, function (i, el) {
        if ($.inArray(el, unique) === -1) {
          unique.push(el);
        }
      });
      return unique;
    },

    readFromLS: function () {
      console.log('readFromLS()');
      console.log(rfsbundlescraper.bundle);
      if (rfsbundlescraper.bundle != null) {
        console.log('-- if(rfsbundlescraper.bundle != null');
        console.log('rfsbundlescraper.bundle');
        console.log(rfsbundlescraper.bundle);
        if (rfsbundlescraper.utils.site.humblebundle)
          rfsbundlescraper.bundle = JSON.parse(localStorage.getItem(rfsbundlescraper.utils.json_names.humblebundle));
        else if (rfsbundlescraper.utils.site.indiegala)
          rfsbundlescraper.bundle = JSON.parse(localStorage.getItem(rfsbundlescraper.utils.json_names.indiegala));
        $('#rfs-games-list').val(JSON.stringify(rfsbundlescraper.bundle, null, 2));
      }
      else{
        console.log('-- else');
        $('#rfs-games-list').val('No Bundle in Local Storage');
      }
    }
  },

  indiegala: {

    ig_init: function () {

      $('#ig_autoclick_btn').show();

      rfsbundlescraper.utils.loadSettings();

      if ($('#rfs-container').length == 0)
        rfsbundlescraper.utils.add_floating_textarea();

      if (localStorage.getItem(rfsbundlescraper.utils.json_names.indiegala) != null) {
        rfsbundlescraper.combine = true;
        console.log('Loading existing bundle calling readFromLS()');
        rfsbundlescraper.utils.readFromLS();
//        rfsbundlescraper.bundle = JSON.parse(localStorage.getItem(rfsbundlescraper.utils.json_names.indiegala));
        console.log('bundle.games.length: ' + rfsbundlescraper.bundle.games.length);

        if (rfsbundlescraper.bundle.url === window.location.href) {
          console.log("rfsbundlescraper.bundle.url: " + rfsbundlescraper.bundle.url + " === window.location.href: " + window.location.href);
          rfsbundlescraper.exists = true;
        }
      }
      else {
        rfsbundlescraper.combine = false;
        console.log('No existing bundle...');
        console.log(rfsbundlescraper.bundle);

        rfsbundlescraper.bundle.title = $('.text_align_center h2')[0].innerText;
        rfsbundlescraper.bundle.title_slug = rfsbundlescraper.utils.convertToSlug(rfsbundlescraper.bundle.title);
        rfsbundlescraper.bundle.site = "IndieGala";

        rfsbundlescraper.bundle.games = [];
      }
    },

    ig_run: function () {

      console.log('before ig_init()');
      console.log(rfsbundlescraper.bundle);
      this.ig_init();
      console.log('after ig_init()');
      console.log(rfsbundlescraper.bundle);

      do
      {
        if (rfsbundlescraper.utils.ig_giftLinks.length >= 1 &&
          rfsbundlescraper.utils.interval == 0) {
          this.clickGiftImages();
        }
      } while (rfsbundlescraper.utils.ig_giftLinks.length > 0 && rfsbundlescraper.utils.interval != 0);

      if (!this.exists) {
        this.gatherDRMGames();

        if (!this.combine) {
          this.gatherDRMFreeGames();
          this.gatherMusicTracks();
          this.gatherAndroidGames();
        }
        rfsbundlescraper.utils.removeDupes(rfsbundlescraper.bundle.games);
        rfsbundlescraper.utils.saveToLS(rfsbundlescraper.utils.json_names.indiegala);
      }
      else {
        console.log('It\'s the same bundle dude!');
        console.log('this.exists == true');
        rfsbundlescraper.utils.readFromLS();
      }
    },

    gatherDRMGames: function () {
      console.log(rfsbundlescraper.bundle);

      var titles = $('.title_game a');
      var drm, game, key;

      var steamLinkIndex = 0;

      var otherKeys = $('.keys');
      var steamLinks = $('.keyfield a');
      var smalltits2 = $('.small-tits2');

      if (steamLinks.length != 0) {
        console.log('New Bundle Type');
        console.log('number of games: ' + titles.length);

        o: for (var i = 0; i < titles.length; i++) {
          console.log('-- ' + i);
          if (rfsbundlescraper.combine) {
            game = rfsbundlescraper.bundle.games[i];
            console.log('Combining ' + rfsbundlescraper.bundle.games[i].title);
          } else {
            console.log('---------- NOT COMBINING ----------');

            game = {
              title: '',
              title_slug: '',
              store_url: '',
              drm: '',
              keys: []
            };
          }

          drm = titles[i].href;
          key = {};
          key.gift_url = window.location.href;

          if (drm.match(/desura/) || ( i < smalltits2.length && smalltits2[i].text.match(/desura/i))) {
            game.drm = 'Desura';
            key.key = otherKeys[i].value;
          }
          else if (drm.match(/origin/)) {
            game.drm = 'Origin';
            key.key = otherKeys[i].value;
          }
          else if (drm.match(/steam/) || drm.match(/indiegala/)) {
            game.drm = 'Steam';
            key.key = steamLinks[steamLinkIndex].href;
            steamLinkIndex++;
          }
          else if (drm.match(/gamersgate/)) {
            game.drm = 'GamersGate';
            key.key = otherKeys[i].value;
          }
          else if (drm.match(/gog/)) {
            game.drm = 'GOG';
            key.key = otherKeys[i].value;
          }

          for (var j = 0; j < game.keys.length; j++) {
            if (key.key == game.keys[j].key) {
              console.log('found a match!');
              i = titles.length + 3;
              continue o;
            }
          }
          game.keys.push(key);

          if (rfsbundlescraper.combine) {
            rfsbundlescraper.bundle.games[i] = game;
          }
          else {
            game.title = titles[i].text;
            game.title_slug = rfsbundlescraper.utils.convertToSlug(game.title) + '-' + game.drm.toLowerCase();
            game.store_url = titles[i].href;
            console.log('titles[' + i + '].text: ');
            console.log(titles[i].text);
            rfsbundlescraper.bundle.games.push(game);
            console.log('rfsbundlescraper.bundle: ');
            console.log(rfsbundlescraper.bundle);
          }
        }
      }
      else {
        console.log('Old Bundle type');

        var titlesOldBundles = $('#steam-key #stringa-game-key .title_game a');

        var keys = $('.keys');

        p: for (i = 0; i < titlesOldBundles.length; i++) {
          if (rfsbundlescraper.combine) {
            game = rfsbundlescraper.bundle.games[i];
            console.log('Combining ' + rfsbundlescraper.bundle.games[i].title);
            console.log('i is ' + i);
          } else {
            game = {
              title: '',
              title_slug: '',
              store_url: '',
              drm: '',
              keys: []
            };
          }

          key = {};

          console.log(titlesOldBundles[i].innerText);

          drm = titlesOldBundles[i].href;
          if (drm.match(/desura/))
            game.drm = 'Desura';
          else if (drm.match(/origin/))
            game.drm = 'Origin';
          else if (drm.match(/steam/))
            game.drm = 'Steam';
          else if (drm.match(/gamersgate/))
            game.drm = 'GamersGate';
          else if (drm.match(/gog/))
            game.drm = 'GOG';

          game.title = titlesOldBundles[i].innerText;
          game.title_slug = rfsbundlescraper.utils.convertToSlug(game.title) + '-' + game.drm.toLowerCase();
          game.store_url = titlesOldBundles[i].href;

          key.key = keys[i].value;
          key.url = window.location.href;

          for (var k = 0; k < game.keys.length; k++) {
            if (key.key == game.keys[k].key) {
              console.log('found a match!');
              i = titlesOldBundles.length + 3;
              continue p;
            }
          }
          game.keys.push(key);

          if (rfsbundlescraper.combine) {
            rfsbundlescraper.bundle.games[i] = game;
          }
          else {
            rfsbundlescraper.bundle.games.push(game);
          }
        }
      }
      rfsbundlescraper.utils.saveToLS();
    },

    gatherDRMFreeGames: function () {
      var drmFreeGames = $('#drm-free-games #stringa-music-key');
      var drmFreeGamesTitles = $('#drm-free-games #stringa-music-key .title_game');
      var drmFreeGamesPlatforms = $('#drm-free-games #stringa-music-key .title_dev');
      var drmFreeGamesDLLink = $('#drm-free-games #stringa-music-key .button');

      if (drmFreeGames.length > 0) {
        rfsbundlescraper.bundle.drmFreeGames = [];
        var drmFreeGame;

        for (var i = 0; i < drmFreeGames.length; i++) {
          drmFreeGame = {};
          drmFreeGame.title = drmFreeGamesTitles[i].innerText.replace(/\t/g, '').replace(/\n/g, '').replace(/  /g, '');
          drmFreeGame.title_slug = rfsbundlescraper.utils.convertToSlug(drmFreeGame.title);
          drmFreeGame.platform = drmFreeGamesPlatforms[i].innerText;
          drmFreeGame.dllink = drmFreeGamesDLLink[i].href;

          rfsbundlescraper.bundle.drmFreeGames.push(drmFreeGame);
        }
      }
    },

    gatherMusicTracks: function () {

      var musictrack;

      var musicTracks = $('#music #stringa-music-key');
      var musicTitles = $('#music #stringa-music-key .title_music');
      var musicDev = $('#music #stringa-music-key .title_dev');

      if (musicTracks.length > 0) {
        rfsbundlescraper.bundle.musictracks = [];

        for (var i = 0; i < musicTracks.length; i++) {
          musictrack = {};
          /* forgive the magic numbers in the arrays. they are necessary to drill down to the location of the given required information */
          var MP3DLLink = $('#music .span-keys')[i].children[0].children[0].children[0].href;
          var MP3DLLinkText = $('#music .span-keys')[i].children[0].children[0].children[1].innerText;

          var FLACDLLink = $('#music .span-keys')[i].children[1].children[0].children[0].href;
          var FLACDLLinkText = $('#music .span-keys')[i].children[1].children[0].children[1].innerText;

          musictrack.title = musicTitles[i].innerText.replace(/\t/g, '').replace(/\n/g, '').replace(/  /g, '');
          musictrack.title_slug = rfsbundlescraper.utils.convertToSlug(musictrack.title);
          musictrack.dev = musicDev[i].innerText.replace(/\t/g, '').replace(/\n/g, '').replace(/  /g, '');
          musictrack.dev_slug = rfsbundlescraper.utils.convertToSlug(musictrack.dev);

          musictrack.mp3dllink = MP3DLLink;
          musictrack.mp3type = MP3DLLinkText;
          musictrack.flacdllink = FLACDLLink;
          musictrack.flactype = FLACDLLinkText;

          rfsbundlescraper.bundle.musictracks.push(musictrack);
        }
      }
    },

    gatherAndroidGames: function () {

      var androidgame;

      var androidGameTitle = $('#android #stringa-android-key .title_game');
      var androidGameLink = $('#android #stringa-android-key .button');

      if (androidGameTitle.length > 0) {
        rfsbundlescraper.bundle.androidgames = [];

        for (var i = 0; i < androidGameTitle.length; i++) {
          androidgame = {};
          androidgame.title = androidGameTitle[i].innerText.replace(/\t/g, '').replace(/\n/g, '').replace(/  /g, '');
          androidgame.title_slug = rfsbundlescraper.utils.convertToSlug(androidgame.title);
          androidgame.dllink = androidGameLink[i].href;

          rfsbundlescraper.bundle.androidgames.push(androidgame);
        }
      }
    },

    cleanup: function () {
      if (rfsbundlescraper.bundle.hasOwnProperty('drmFreeGames'))
        delete rfsbundlescraper.bundle.drmFreeGames;
      if (rfsbundlescraper.bundle.hasOwnProperty('musictracks'))
        delete rfsbundlescraper.bundle.musictracks;
      if (rfsbundlescraper.bundle.hasOwnProperty('androidgames'))
        delete rfsbundlescraper.bundle.androidgames;
    },

    clickGiftImages: function () {
      if (rfsbundlescraper.utils.ig_giftLinks.length > 0) {
        var interval = setInterval(function () {
          if (rfsbundlescraper.utils.ig_giftLinks.length == 0) {
            clearInterval(interval);
          }
          else {
            rfsbundlescraper.utils.ig_giftLinks = $('#icon-gift img');
            rfsbundlescraper.utils.ig_giftLinks[0].click();
            rfsbundlescraper.utils.ig_giftLinks[0].remove();
            console.log('removing img');
          }
        }, 2000);
      }
      else {
        console.log('No gift images to click... continue on...');
      }
    }

  },

  humblebundle: {

    titles: [],
    giftLinks: [],
    bundle: {},
    currentPlatforms: [],
    combine: false,
    drm_free_titles: $('div.gameinfo div.title a'),
    drm_free_subtitles: $('div.gameinfo div.subtitle a'),
    secondaryTitles: $(':nth-child(7) .shrinksizer-new .redeemheading'),
    secondaryKeys: $(':nth-child(7) .shrinksizer-new .keyfield'),
    tertiaryTitles: $(':nth-child(8) .shrinksizer-new .redeemheading'),
    tertiaryKeys: $(':nth-child(8) .shrinksizer-new .keyfield'),
    icons: $('div.icn'),
    windls: $('div.js-platform.downloads.windows div.download-buttons'),
    macdls: $('div.js-platform.downloads.mac div.download-buttons'),
    linuxdls: $('div.js-platform.downloads.linux div.download-buttons'),
    androiddls: $('div.js-platform.downloads.android div.download-buttons'),
    audiodls: $('div.js-platform.downloads.audio div.download-buttons'),
    ebookdls: $('div.js-platform.downloads.ebook div.download-buttons'),
    comedydls: $('div.js-platform.downloads.comedy div.download-buttons'),

    hb_init: function () {
      console.log('detected Humble Bundle');

      rfsbundlescraper.utils.loadSettings();
      rfsbundlescraper.utils.readFromLS();

      if ($('#rfs-container').length == 0) {
        rfsbundlescraper.utils.add_floating_textarea();
      }

      if (rfsbundlescraper.bundle != undefined) {
        if (rfsbundlescraper.bundle.title === $('title').text().replace(' (pay what you want and help charity)', '')) {
          this.combine = true;
          console.log('detected same bundle. Changing to combine mode');
        }
      }

      this.init();

      if (!this.combine) {
        if (rfsbundlescraper.utils.hb_giftLinks.length == 0)
          this.run();
        else
          rfsbundlescraper.utils.appendText("Click the AutoClick button above");
      }
      else
        this.run_combine();

      rfsbundlescraper.utils.readFromLS();
    },

    hb_run: function () {
      this.hb_init();
    },

    init: function () {
      'use strict';
      this.titles.length = 0;
      this.giftLinks.length = 0;
      this.bundle = {};

      var bundle_name = $('title').text();

      this.bundle.title = bundle_name.replace(' (pay what you want and help charity)', '');
      this.bundle.title_slug = rfsbundlescraper.utils.convertToSlug(this.bundle.title);
      this.bundle.site = "Humble Bundle";
      this.bundle.url = $(location).attr('href');

      this.bundle.items = [];

      if (localStorage.getItem(rfsbundlescraper.utils.json_names.humblebundle) != null) {
        console.log(rfsbundlescraper.utils.json_names.humblebundle + " found in Local Storage");
        this.bundle = JSON.parse(localStorage.getItem(rfsbundlescraper.utils.json_names.humblebundle));
      }
    },

    run: function () {
      'use strict';

      var i, keys = false;
      var item = {
        title: '',
        title_slug: '',
        keys: [],
        platforms: []
      };
      var key = {};

      this.bundle.items = [];

      this.titles = $('.redeemheading');

      if ($('.keyfield a').length > 0) {
        this.giftLinks = $('.keyfield a');
        keys = false;
      }
      else {
        this.giftLinks = $('.keyfield');
        keys = true;
      }

      console.log('-------- MAIN BODY ITEMS --------');
      for (i = 0; i < this.giftLinks.length; i++) {

        key = {
          key: '',
          bundle_url: ''
        };

        item = {
          title: '',
          title_slug: '',
          keys: []
        };

        item.keys = [];
        item.title = this.titles[i].textContent;
        item.title_slug = rfsbundlescraper.utils.convertToSlug(item.title);

        if (!keys) {
          key.key = this.giftLinks[i].href;
        }
        else {
          key.key = this.giftLinks[i].textContent;
        }

        if (key.key.match(/Click the button to redeem on Steam/)) {
          i = this.giftLinks.length + 3;
          continue;
        }

        key.bundle_url = window.location.href;

        console.log('adding the first key to ' + item.title);
        item.keys.push(key);

        this.bundle.items.push(item);

        console.log(i + ". " + item.title);
      }

      console.log('-------- SECONDARY ITEMS --------');
      if (this.secondaryTitles.length > 0 && $('#secondaryItems').is(':checked')) {
        console.log('found secondary titles');

        for (var k = 0; k < this.secondaryKeys.length; k++) {
          item = {
            title: '',
            title_slug: '',
            keys: []
          };

          key = {};

          item.title = this.secondaryTitles[k].innerText;
          item.title_slug = rfsbundlescraper.utils.convertToSlug(this.secondaryTitles[k].innerText);

          key.bundle_url = window.location.href;
          key.key = this.secondaryKeys[k].innerText;

          console.log('adding the first key to ' + this.secondaryTitles[k].innerText);
          item.keys.push(key);

          this.bundle.items.push(item);
          console.log(k + ". " + item.title);
        }
      }

      console.log('-------- TERTIARY ITEMS --------');
      if (this.tertiaryTitles.length > 0 && $('#tertiaryItems').is(':checked')) {
        console.log('found tertiary titles');

        if (this.tertiaryKeys.length == 0)
          this.tertiaryKeys = $('.overgrowthspf_link');

        for (k = 0; k < this.tertiaryKeys.length; k++) {
          console.log('k: ' + k);
          console.log('i: ' + i);

          item = {
            title: '',
            title_slug: '',
            keys: []
          };

          key = {};

          item.title = this.tertiaryTitles[k].innerText;
          item.title_slug = rfsbundlescraper.utils.convertToSlug(this.tertiaryTitles[k].innerText);

          key.bundle_url = window.location.href;
          key.key = this.tertiaryKeys[k].innerText;

          console.log('adding the first key to ' + this.tertiaryTitles[k].innerText);
          item.keys.push(key);

          this.bundle.items.push(item);
          console.log(k + ". " + item.title);
        }
      }

      console.log('-------- GOG TAB ITEMS --------');
      var gogTabTitles = $('#gog-tab .redeemheading');
      var gogTabKeys = $('#gog-tab .keyfield');

      if (gogTabTitles.length > 0) {
        console.log('found gog-tab titles');

        for (k = 0; k < gogTabKeys.length; k++) {
          item = {
            title: '',
            title_slug: '',
            keys: []
          };

          key = {};

          item.title = gogTabTitles[k].innerText;
          item.title_slug = rfsbundlescraper.utils.convertToSlug(gogTabTitles[k].innerText);

          key.bundle_url = window.location.href;
          key.key = gogTabKeys[k].innerText;

          console.log('adding the first key to ' + gogTabTitles[k].innerText);
          item.keys.push(key);

          this.bundle.items.push(item);
          console.log(k + ". " + item.title);
        }
      }

      console.log('-------- DRM FREE --------');
      for (i = 0; i < this.drm_free_titles.length; i++) {
        var title = this.drm_free_titles[i];
        var subtitle = this.drm_free_subtitles[i];
        var icon = this.icons[i];
        var windl = this.windls[i];
        var macdl = this.macdls[i];
        var linuxdl = this.linuxdls[i];
        var androiddl = this.androiddls[i];
        var audiodl = this.audiodls[i];
        var ebookdl = this.ebookdls[i];
        var comedydl = this.comedydls[i];

        item = {};

        item.title = title.text.trim();
        item.developer = subtitle.text.trim();
        item.title_slug = rfsbundlescraper.utils.convertToSlug(item.developer) + "-" + rfsbundlescraper.utils.convertToSlug(item.title);
        item.url = subtitle.attributes['href']['value'];
        if (icon.children[0].children[0] != undefined)
          item.icon = icon.children[0].children[0].attributes['src']['value'];

        item.platforms = [];

        console.log(i + ". " + item.title);

////        var thisPlatform = {};
//
//        item = this.process(item, windl, "Windows");
//        item = this.process(item, macdl, "Mac");
//        item = this.process(item, linuxdl, "Linux");
//        item = this.process(item, androiddl, "Android");
//        item = this.process(item, audiodl, "Audio");
//        item = this.process(item, comedydl, 'Comedy');
//        item = this.process(item, ebookdl, 'eBook');

        for(i=0; i< windl.children; i++){
          rfsbundlescraper.humblebundle.new_process(item, value, 'Windows');
        }
        rfsbundlescraper.humblebundle.bundle.items.push(item);
//
//        $.each(macdl.children, function(index, value){
//          rfsbundlescraper.humblebundle.new_process(rfsbundlescraper.humblebundle.run.item, value, 'Mac');
//        });
//        rfsbundlescraper.humblebundle.bundle.items.push(item);
//
//        $.each(linuxdl.children, function(index, value){
//          rfsbundlescraper.humblebundle.new_process(rfsbundlescraper.humblebundle.run.item, value, 'Linux');
//        });
//        rfsbundlescraper.humblebundle.bundle.items.push(item);
//
//        $.each(androiddl.children, function(index, value){
//          rfsbundlescraper.humblebundle.new_process(rfsbundlescraper.humblebundle.run.item, value, 'Android');
//        });
//        rfsbundlescraper.humblebundle.bundle.items.push(item);
//
//        $.each(audiodl.children, function(index, value){
//          rfsbundlescraper.humblebundle.new_process(rfsbundlescraper.humblebundle.run.item, value, 'Audio');
//        });
//        rfsbundlescraper.humblebundle.bundle.items.push(item);
//
//        $.each(comedydl.children, function(index, value){
//          rfsbundlescraper.humblebundle.new_process(rfsbundlescraper.humblebundle.run.item, value, 'Comedy');
//        });
//        rfsbundlescraper.humblebundle.bundle.items.push(item);
//
//        $.each(ebookdl.children, function(index, value){
//          rfsbundlescraper.humblebundle.new_process(rfsbundlescraper.humblebundle.run.item, value, 'eBook');
//        });
//        rfsbundlescraper.humblebundle.bundle.items.push(item);
      }

      rfsbundlescraper.bundle = rfsbundlescraper.humblebundle.bundle;

      rfsbundlescraper.utils.saveToLS(rfsbundlescraper.utils.json_names.humblebundle);

      rfsbundlescraper.utils.readFromLS();
    },

    new_process: function(item, value, platform){

      if (value.className !== "custom-download-text") {
        var info = {};
        info.platform = platform;
        item.platforms = [];

        if (value.children[0].childElementCount > 0)
          info.format = value.children[0].children[1].innerHTML;
        if (value.children[1].children[0].childElementCount > 0)
          info.size = value.children[1].children[0].children[0].innerHTML;

        var dllinks = value.children[0].children[2];

        if (dllinks.hasAttribute('data-web'))
          info.http = dllinks.attributes['data-web']['value'];

        if (dllinks.hasAttribute('data-bt'))
          info.bt = dllinks.attributes['data-bt']['value'];

        if (value.hasAttribute('data-md5'))
          info.hash = value.attributes['data-md5']['value'];
      }

      item.platforms.push(info);
    },

    run_combine: function () {
      var keys = false, key = {}, item, totalTitles;

      this.titles = $('.redeemheading');

      if ($('.keyfield a').length > 0) {
        this.giftLinks = $('.keyfield a');
        keys = false;
      }
      else {
        this.giftLinks = $('.keyfield');
        keys = true;
      }

      console.log('-------- MAIN BODY ITEMS --------');
      a: for (var i = 0; i < this.giftLinks.length; i++) {

        key = {
          key: '',
          bundle_url: ''
        };

        if (!keys) {
          key.key = this.giftLinks[i].href;
        }
        else {
          key.key = this.giftLinks[i].textContent;
        }

        if (key.key.match(/Click the button to redeem on Steam/)) {
          i = this.giftLinks.length + 3;
          continue;
        }

        key.bundle_url = window.location.href;

        //check for dupes
        for (var j = 0; j < rfsbundlescraper.bundle.items[i].keys.length; j++) {
          console.log('checking key ' + rfsbundlescraper.bundle.items[i].keys[j].key + ' against ' + key.key);
          if (key.key == rfsbundlescraper.bundle.items[i].keys[j].key) {
            console.log('found a match, skipping');
            i = this.giftLinks.length + 3;
            continue a;
          }
        }

        console.log('adding another key to ' + rfsbundlescraper.bundle.items[i].title);

        rfsbundlescraper.bundle.items[i].keys.push(key);

        console.log(i + ". " + rfsbundlescraper.bundle.items[i].title);
      }

      console.log('-------- SECONDARY ITEMS --------');
      if (this.secondaryTitles.length > 0 && $('#secondaryItems').is(':checked')) {
        console.log('found secondary titles');
        if ($('#tertiaryItems').is(':checked'))
          totalTitles = this.tertiaryKeys.length + this.giftLinks.length + this.secondaryKeys.length;
        else
          totalTitles = this.secondaryKeys.length + this.giftLinks.length;
        for (var k = 0; i < (this.secondaryKeys.length + this.giftLinks.length); k++) {
          item = rfsbundlescraper.bundle.items[i];

          key = {};

          item.title = this.secondaryTitles[k].innerText;
          item.title_slug = rfsbundlescraper.utils.convertToSlug(this.secondaryTitles[k].innerText);

          key.bundle_url = window.location.href;
          key.key = this.secondaryKeys[k].innerText;

          console.log('adding another key to ' + this.secondaryTitles[k].innerText);
          item.keys.push(key);

          console.log(k + ". " + item.title);
          i++;
        }
      }

      console.log('-------- TERTIARY ITEMS --------');
      if (this.tertiaryTitles.length > 0 && $('#tertiaryItems').is(':checked')) {
        console.log('found tertiary titles');
        if ($('#secondaryItems').is(':checked'))
          totalTitles = this.tertiaryKeys.length + this.giftLinks.length + this.secondaryKeys.length;
        else
          totalTitles = this.tertiaryKeys.length + this.giftLinks.length;
        for (k = 0; i < totalTitles; k++) {
          console.log('k: ' + k);
          console.log('i: ' + i);
          console.log('tertiaryTitles[k]: ');
          console.log(this.tertiaryTitles[k]);


          item = rfsbundlescraper.bundle.items[i];

          key = {};

          item.title = this.tertiaryTitles[k].innerText;
          item.title_slug = rfsbundlescraper.utils.convertToSlug(this.tertiaryTitles[k].innerText);

          key.bundle_url = window.location.href;
          key.key = this.tertiaryKeys[k].innerText;

          console.log('adding another key to ' + this.tertiaryTitles[k].innerText);
          item.keys.push(key);

          console.log(k + ". " + item.title);
          i++;
        }
      }

      rfsbundlescraper.utils.saveToLS(rfsbundlescraper.utils.json_names.humblebundle);

      rfsbundlescraper.utils.readFromLS();
    },

    process: function (item, platformdl, type) {
      'use strict';
//      if (type === "Windows")
//        platform.windows = [];
//      else if (type === "Mac")
//        platform.mac = [];
//      else if (type === "Linux")
//        platform.linux = [];
//      else if (type === "Audio")
//        platform.audio = [];
//      else if (type === "Android")
//        platform.android = [];
//      else if (type === "Comedy")
//        platform.comedy = [];
//      else if (type === "eBook")
//        platform.ebook = [];

      if (platformdl.children.length > 0) {
        for (var j = 0; j <= platformdl.children.length - 1; j++) {
          if (platformdl.children[j].className !== "custom-download-text") {
            var info = {};
            info.platform = type;
            item.platforms = [];

            if (platformdl.children[j].children[0].childElementCount > 0)
              info.format = platformdl.children[j].children[0].children[1].innerHTML;
            if (platformdl.children[j].children[1].children[0].childElementCount > 0)
              info.size = platformdl.children[j].children[1].children[0].children[0].innerHTML;

            var dllinks = platformdl.children[j].children[0].children[2];

            if (dllinks.hasAttribute('data-web'))
              info.http = dllinks.attributes['data-web']['value'];

            if (dllinks.hasAttribute('data-bt'))
              info.bt = dllinks.attributes['data-bt']['value'];

            if (platformdl.children[j].hasAttribute('data-md5'))
              info.hash = platformdl.children[j].attributes['data-md5']['value'];

//            item.platforms.push(info);

//            if (type == "Windows") {
//              platform.windows.push(info);
//            }
//            else if (type == "Mac") {
//              platform.mac.push(info);
//            }
//            else if (type == "Linux") {
//              platform.linux.push(info);
//            }
//            else if (type == "Audio") {
//              platform.audio.push(info);
//            }
//            else if (type == "Android") {
//              platform.android.push(info);
//            }
//            else if (type == "Comedy") {
//              platform.comedy.push(info);
//            }
//            else if (type == "eBook") {
//              platform.ebook.push(info);
//            }

//            console.log('before:');
//            console.log(platform);
//            var cleanPlatform = this.cleanup(platform);
//            console.log('after:');
//            console.log(platform);

//            item.platforms.push(cleanPlatform);
//            item.platforms = this.removeDupeProperties(item.platforms);
//            console.log(item);
//            item.platforms = this.cleanup(item.platforms);
          }
        }
      }
      return item;
    },

    removeDupeProperties: function (platforms) {
      var i;

      /*
       This goes though the platforms array and removes duplicate objects leaving only 1 left.
       Notice I am going length-1 so that the i+1 does not go out of bounds. This is just a simple
       comparison check and then popping the last item if the two match.
       */
      for (i = 0; i < platforms.length - 1; i++) {
        if (platforms[i] === platforms[i + 1])
          platforms.pop();
      }
    },

    cleanup: function (platforms) {
      'use strict';
      /*
       removing empty properties from the platforms object to make things a little more tidy
       I am not sure why it insists on creating the empty objects. This is a roundabout way of
       removing them but it works. I am not worried about performance because this script only
       runs one page at a time
       */
      if (platforms.hasOwnProperty('windows') && platforms.windows.length == 0) {
        if (delete platforms.windows)
          console.log('deleted empty platforms.windows')
      }
      if (platforms.hasOwnProperty('mac') && platforms.mac.length == 0) {
        if (delete platforms.mac)
          console.log('deleted empty platforms.mac')
      }
      if (platforms.hasOwnProperty('linux') && platforms.linux.length == 0) {
        if (delete platforms.linux)
          console.log('deleted empty platforms.linux')
      }
      if (platforms.hasOwnProperty('audio') && platforms.audio.length == 0) {
        if (delete platforms.audio)
          console.log('deleted empty platforms.audio')
      }
      if (platforms.hasOwnProperty('android') && platforms.android.length == 0) {
        if (delete platforms.android)
          console.log('deleted empty platforms.android')
      }
      if (platforms.hasOwnProperty('comedy') && platforms.comedy.length == 0) {
        if (delete platforms.comedy)
          console.log('deleted empty platforms.comedy')
      }
      if (platforms.hasOwnProperty('ebook') && platforms.ebook.length == 0) {
        if (delete platforms.ebook)
          console.log('deleted empty platforms.ebook')
      }

      return platforms;
    },

    clearLS: function () {
      localStorage.removeItem(rfsbundlescraper.utils.json_names.humblebundle);
    },

    checkLS: function () {
      if (localStorage.getItem(rfsbundlescraper.utils.json_names.humblebundle)) {
        var ls = JSON.parse(localStorage.getItem(rfsbundlescraper.utils.json_names.humblebundle));
        console.log("Local Storage item " + rfsbundlescraper.utils.json_names.humblebundle + " has " + ls.length + " items in the array.");
      }
      else {
        console.log("Local Storage item " + rfsbundlescraper.utils.json_names.humblebundle + " does not exist!");
      }
    },

    clickGiftImages: function () {
      if ($('genericbutton').length > 0)
        $('.genericbutton').click();

      if (rfsbundlescraper.utils.hb_giftLinks.length > 0) {
        rfsbundlescraper.utils.hb_interval = setInterval(function () {
          if (rfsbundlescraper.utils.hb_giftLinks.length == 0) {
            clearInterval(rfsbundlescraper.utils.hb_interval);
          }
          else {
            rfsbundlescraper.utils.hb_giftLinks = $('#steam-tab img');

            var title = rfsbundlescraper.utils.hb_giftLinks[0].parentNode.parentNode.previousElementSibling.innerText;

            rfsbundlescraper.utils.hb_giftLinks[0].click();
            rfsbundlescraper.utils.hb_giftLinks[0].remove();

            $('div.grayout-inner a.button-link.submit').click();

            rfsbundlescraper.utils.appendText('clicked ' + title + "\n");
          }
        }, 2000);
      }
      else {
        console.log('No gift images to click... continue on...');
      }
    }
  }
};

console.log(rfsbundlescraper.bundle);

rfsbundlescraper.run();