var VERSION = '0.8151440';

var rfsbundlescraper = {

  combine: false,
  exists: false,
  debug : true,
  bundle : {
    name: '',
    name_slug: '',
    site: '',
    games: []
  },

  run: function(){
    this.utilities.detect_site();

    if(this.utilities.site === 'indiegala')
      this.indiegala.ig_run();
    else if(this.utilities.site === 'humblebundle')
      this.humblebundle.hb_run();
  },

  utilities : {
    href: window.location.href,
    site: '',
    interval : 0,
    giftLinks : $('#icon-gift img'),
    cacheBuster: 0,
    oldCacheBuster: 0,
    firstReload: true,
    rfsSettingsTextHeight: 400,
    rfsSettingsTextWidth: 315,
    rfsSettingsAutoClick: true,

    detect_site: function(){
      if(this.href.match(/indiegala/))
        this.site = 'indiegala';
      else if(this.href.match(/humblebundle/))
        this.site = 'humblebundle';
    },

    toggleSettingsDisplay: function(){
      $('div#rfsSettings').toggle();
    },

    updateSettings: function(){
      var textHeight = $('#rfsSettingsTextHeight');
      var textWidth = $('#rfsSettingsTextWidth');
      var autoClick = $('#rfsSettingsAutoClick');
      var textArea = $('#rfs-games-list');

      localStorage.setItem('rfsSettingsTextHeight', textHeight.val());
      localStorage.setItem('rfsSettingsTextWidth', textWidth.val());
      localStorage.setItem('rfsSettingsAutoClick', autoClick.prop('checked'));

      var cssString = "height: " + textHeight.val() + "px !important; width: " + textWidth.val() + "px !important";

      textArea.css('cssText', cssString);
    },

    loadSettings: function(){
      if(localStorage.getItem('rfsSettingsTextHeight') != null)
      {
        var checked = localStorage.getItem('rfsSettingsAutoClick');
        console.log('checked: ' + checked);

        $('#rfsSettingsTextHeight').val(localStorage.getItem('rfsSettingsTextHeight'));
        $('#rfsSettingsTextWidth').val(localStorage.getItem('rfsSettingsTextWidth'));

        if(checked === 'true')
        {
          $('#rfsSettingsAutoClick').prop('checked', false).click();
          console.log('ticking the checkbox')
        }
        else
        {
          $('#rfsSettingsAutoClick').prop('checked', true).click();
          console.log('unticking the checkbox')
        }
      }
      else
      {
        var textHeight = $('#rfsSettingsTextHeight');
        var textWidth = $('#rfsSettingsTextWidth');
        var textArea = $('#rfs-games-list');

        textArea.height(textHeight.val());
        textArea.width(textWidth.val());
      }
    },

    reloadScript: function()
    {
      var src = "https://raw.githack.com/tvl83/GameBundleScraper/master/rfsbundlescraper.js";

      $('#rfs-container').remove();

      if(this.firstReload)
      {
        this.cacheBuster = Date.now().toString();
        console.log(this.cacheBuster);
        $('script[src="' + src + '"]').remove();
        $('<script>').attr('src', src + "?" + this.cacheBuster).appendTo('body');
        this.oldCacheBuster = this.cacheBuster;
        console.log(this.oldCacheBuster);
        this.firstReload = false;
      }
      else
      {
        this.cacheBuster = Date.now().toString();
        $('script[src="' + src + '?' + this.oldCacheBuster + '"]').remove();
        $('<script>').attr('src', src + "?" + this.cacheBuster).appendTo('body');
        this.oldCacheBuster = this.cacheBuster;
      }

      this.updateSettings();
    },

    saveToLS : function()  {
      if(rfsbundlescraper.utilities.site === 'indiegala')
        localStorage.setItem('RFSIGBundle', JSON.stringify(rfsbundlescraper.bundle, null, 2));
      else if(rfsbundlescraper.utilities.site === 'humblebundle')
        localStorage.setItem('RFSHBBundle', JSON.stringify(rfsbundlescraper.bundle, null, 2));
      else if(rfsbundlescraper.utilities.site === 'bundlestars')
        localStorage.setItem('RFSBSBundle', JSON.stringify(rfsbundlescraper.bundle, null, 2));

      rfsbundlescraper.utilities.readFromLS();
    },

    removeFromLS : function()  {
      if(rfsbundlescraper.utilities.site === 'indiegala')
        localStorage.removeItem('RFSIGBundle');
      else if(rfsbundlescraper.utilities.site === 'humblebundle')
        localStorage.removeItem('RFSHBBundle');
      else if(rfsbundlescraper.utilities.site === 'bundlestars')
        localStorage.removeItem('RFSBSBundle');

      localStorage.removeItem('rfsSettingsTextHeight');
      localStorage.removeItem('rfsSettingsTextWidth');
      localStorage.removeItem('rfsSettingsAutoClick');

      rfsbundlescraper.bundle = {};
      console.log('rfsbundlescraper.bundle: ' + JSON.stringify(rfsbundlescraper.bundle, null, 2));
      console.log('rfsbundlescraper.bundle.games: ' + JSON.stringify(rfsbundlescraper.bundle.games, null, 2));
      rfsbundlescraper.utilities.readFromLS();
    },

    resetAndClear : function()  {
      this.combine = false;
      this.exists = false;
      this.debug = true;
      rfsbundlescraper.utilities.removeFromLS();
    },

    close : function()
    {
      $('#rfs-container').remove();
    },

    convertToSlug : function (value){
      return value.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
    },

    removeDupes : function (list) {
      console.log('removing dupes from : ');
      console.log(list);

      var unique = [];
      $.each(list, function(i, el)
      {
        if($.inArray(el, unique) === -1)
        {
          unique.push(el);
        }
      });
      return unique;
    },

    readFromLS: function()
    {
      if(rfsbundlescraper.bundle != null || rfsbundlescraper.bundle != undefined)
        $('#rfs-games-list').val( JSON.stringify(rfsbundlescraper.bundle, null, 2));
      else
        $('#rfs-games-list').val('No Bundle in Local Storage');
    }
  },

  indiegala: {

    ig_init : function(){

      rfsbundlescraper.utilities.loadSettings();

      console.log("RFS Bundle Scraper Bookmarklet v" + VERSION);

      if($('#rfs-container').length == 0)
        $('body').append('<div id="rfs-container" style="position:fixed;bottom:10px;right:10px;z-index:1000;">\n    <div id="rfsSettings" style="color:#f5f5f5;display:none">\n        Height: <input onBlur="rfsbundlescraper.utilities.updateSettings()" type="text" id="rfsSettingsTextHeight" style="width:50px" value="408">\n        Width: <input onBlur="rfsbundlescraper.utilities.updateSettings()" type="text" id="rfsSettingsTextWidth" style="width:50px" value="415">\n        Auto Click Gift Links: <input onChange="rfsbundlescraper.utilities.updateSettings()" id="rfsSettingsAutoClick" type="checkbox" checked="checked">\n    </div>\n    \n    <button onClick="rfsbundlescraper.utilities.toggleSettingsDisplay()" id="rfsSettingsBtn" class="btn-info">Settings</button>\n    <button class="btn-warning" onClick="rfsbundlescraper.utilities.reloadScript();">Reload</button>\n    <button class="btn-info" onClick="rfsbundlescraper.utilities.readFromLS();">Load</button>    \n    <button class="btn-default" onClick="rfsbundlescraper.clickGiftImages();">Auto Click</button>\n    <button class="btn-danger pull-right" onClick="rfsbundlescraper.close();">X</button>\n    <button class="btn-danger pull-right" onClick="rfsbundlescraper.utilities.resetAndClear();">Reset/Clear</button>\n     <br /> \n    <textarea onClick="this.select()" id="rfs-games-list" spellcheck="false" style="width: 415px; height: 408px !important"></textarea> \n</div>');

      if(localStorage.getItem('RFSIGBundle') != null)
      {
        rfsbundlescraper.combine = true;
        console.log('Loading existing bundle');
        rfsbundlescraper.utilities.readFromLS();
        rfsbundlescraper.bundle = JSON.parse(localStorage.getItem('RFSIGBundle'));
        console.log('bundle.games.length: ' + rfsbundlescraper.bundle.games.length);

        if(rfsbundlescraper.bundle.url === window.location.href)
        {
          console.log("rfsbundlescraper.bundle.url: " + rfsbundlescraper.bundle.url + " === window.location.href: " + window.location.href);
          rfsbundlescraper.exists = true;
        }
      }
      else {
        console.log('No existing bundle...');
      }

      rfsbundlescraper.bundle.name = $('.text_align_center h2')[0].innerText;
      rfsbundlescraper.bundle.name_slug = rfsbundlescraper.utilities.convertToSlug(rfsbundlescraper.bundle.name);
      rfsbundlescraper.bundle.site = "IndieGala";
    },

    ig_run : function()  {

      this.ig_init();

      console.log('localStorage.getItem(\'rfsSettingsAutoClick\'): ' + localStorage.getItem('rfsSettingsAutoClick'));

      do
      {
        if(rfsbundlescraper.utilities.giftLinks.length >= 1 &&
          rfsbundlescraper.utilities.interval == 0 &&
          localStorage.getItem('rfsSettingsAutoClick') === 'true')
        {
          this.clickGiftImages();
        }
      }while(rfsbundlescraper.utilities.giftLinks.length > 0 && rfsbundlescraper.utilities.interval != 0);

      if(!this.exists)
      {
        this.gatherDRMGames();

        if(!this.combine)
        {
          this.gatherDRMFreeGames();
          this.gatherMusicTracks();
          this.gatherAndroidGames();

          this.cleanup()
        }
        rfsbundlescraper.utilities.removeDupes(rfsbundlescraper.bundle.games);
        rfsbundlescraper.utilities.saveToLS();
      }
      else
      {
        console.log('It\'s the same bundle dude!');
      }

      rfsbundlescraper.utilities.readFromLS();
    },

    gatherDRMGames : function()  {

      var titles = $('.title_game a');
      var drm, game, key;


      var steamLinkIndex = 0;

      var otherKeys = $('.keys');
      var steamLinks = $('.keyfield a');
      var smalltits2 = $('.small-tits2');

      if(steamLinks.length != 0)
      {
        console.log('New Bundle Type');
        console.log('number of games: ' + titles.length);

        o: for(var i = 0; i < titles.length; i++)
        {
          console.log('-- ' + i);
          if(rfsbundlescraper.combine)
          {
            game = rfsbundlescraper.bundle.games[i];
            console.log('Combining ' + rfsbundlescraper.bundle.games[i].title);
          } else {
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

          if(drm.match(/desura/) || ( i < smalltits2.length && smalltits2[i].text.match(/desura/i)))
          {
            game.drm = 'Desura';
            key.key = otherKeys[i].value;
          }
          else if(drm.match(/origin/))
          {
            game.drm = 'Origin';
            key.key = otherKeys[i].value;
          }
          else if(drm.match(/steam/) || drm.match(/indiegala/))
          {
            game.drm = 'Steam';
            key.key = steamLinks[steamLinkIndex].href;
            steamLinkIndex++;
          }
          else if(drm.match(/gamersgate/))
          {
            game.drm = 'GamersGate';
            key.key = otherKeys[i].value;
          }
          else if(drm.match(/gog/))
          {
            game.drm = 'GOG';
            key.key = otherKeys[i].value;
          }

          for(var j=0; j < game.keys.length; j++)
          {
            if(key.key == game.keys[j].key)
            {
              console.log('found a match!');
              i = titles.length+3;
              continue o;
            }
          }
          game.keys.push(key);

          if(rfsbundlescraper.combine)
          {
            rfsbundlescraper.bundle.games[i] = game;
          }
          else
          {
            game.title = titles[i].text;
            game.title_slug = rfsbundlescraper.utilities.convertToSlug(game.title) + '-' + game.drm.toLowerCase();
            game.store_url = titles[i].href;
            rfsbundlescraper.bundle.games.push(game);
          }
        }
      }
      else
      {
        console.log('Old Bundle type');

        var titlesOldBundles = $('#steam-key #stringa-game-key .title_game a');

        var keys = $('.keys');

        p: for(i = 0; i < titlesOldBundles.length; i++)
        {
          if(rfsbundlescraper.combine)
          {
            game = rfsbundlescraper.bundle.games[i];
            console.log('Combining ' + rfsbundlescraper.bundle.games[i].title);
            console.log('i is ' + i);
          }
          else
          {
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
          if(drm.match(/desura/))
            game.drm = 'Desura';
          else if(drm.match(/origin/))
            game.drm = 'Origin';
          else if(drm.match(/steam/))
            game.drm = 'Steam';
          else if(drm.match(/gamersgate/))
            game.drm = 'GamersGate';
          else if(drm.match(/gog/))
            game.drm = 'GOG';

          game.title = titlesOldBundles[i].innerText;
          game.title_slug = rfsbundlescraper.utilities.convertToSlug(game.title) + '-' + game.drm.toLowerCase();
          game.store_url = titlesOldBundles[i].href;

          key.key = keys[i].value;
          key.url = window.location.href;

          for(var k=0; k < game.keys.length; k++)
          {
            if(key.key == game.keys[k].key)
            {
              console.log('found a match!');
              i = titlesOldBundles.length+3;
              continue p;
            }
          }
          game.keys.push(key);

          if(rfsbundlescraper.combine)
          {
            rfsbundlescraper.bundle.games[i] = game;
          }
          else
          {
            rfsbundlescraper.bundle.games.push(game);
          }
        }
      }

      rfsbundlescraper.utilities.removeDupes(rfsbundlescraper.bundle.games);

      for(var z=0; z < rfsbundlescraper.bundle.games.length; z++)
      {
        rfsbundlescraper.utilities.removeDupes(rfsbundlescraper.bundle.games[z].keys);
      }

      rfsbundlescraper.utilities.readFromLS();
    },

    gatherDRMFreeGames: function()  {
      var drmFreeGames = $('#drm-free-games #stringa-music-key');
      var drmFreeGamesTitles = $('#drm-free-games #stringa-music-key .title_game');
      var drmFreeGamesPlatforms = $('#drm-free-games #stringa-music-key .title_dev');
      var drmFreeGamesDLLink = $('#drm-free-games #stringa-music-key .button');

      rfsbundlescraper.bundle.drmFreeGames = [];
      var drmFreeGame;

      for(var i = 0; i < drmFreeGames.length; i++)
      {
        drmFreeGame = {};
        drmFreeGame.title = drmFreeGamesTitles[i].innerText.replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
        drmFreeGame.title_slug = rfsbundlescraper.utilities.convertToSlug(drmFreeGame.title);
        drmFreeGame.platform = drmFreeGamesPlatforms[i].innerText;
        drmFreeGame.dllink = drmFreeGamesDLLink[i].href;

        rfsbundlescraper.bundle.drmFreeGames.push(drmFreeGame);
      }
    },

    gatherMusicTracks: function()  {

      rfsbundlescraper.bundle.musictracks = [];
      var musictrack;

      var musicTracks = $('#music #stringa-music-key');
      var musicTitles = $('#music #stringa-music-key .title_music');
      var musicDev = $('#music #stringa-music-key .title_dev');

      for(var i = 0; i < musicTracks.length; i++)
      {
        musictrack = {};
        /* forgive the magic numbers in the arrays. they are necessary to drill down to the location of the given required information */
        var MP3DLLink = $('#music .span-keys')[i].children[0].children[0].children[0].href;
        var MP3DLLinkText = $('#music .span-keys')[i].children[0].children[0].children[1].innerText;

        var FLACDLLink = $('#music .span-keys')[i].children[1].children[0].children[0].href;
        var FLACDLLinkText = $('#music .span-keys')[i].children[1].children[0].children[1].innerText;

        musictrack.title = musicTitles[i].innerText.replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
        musictrack.title_slug = rfsbundlescraper.utilities.convertToSlug(musictrack.title);
        musictrack.dev = musicDev[i].innerText.replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
        musictrack.dev_slug = rfsbundlescraper.utilities.convertToSlug(musictrack.dev);

        musictrack.mp3dllink = MP3DLLink;
        musictrack.mp3type = MP3DLLinkText;
        musictrack.flacdllink = FLACDLLink;
        musictrack.flactype = FLACDLLinkText;

        rfsbundlescraper.bundle.musictracks.push(musictrack);
      }
    },

    gatherAndroidGames: function()  {
      rfsbundlescraper.bundle.androidgames = [];
      var androidgame;

      var androidGameTitle = $('#android #stringa-android-key .title_game');
      var androidGameLink = $('#android #stringa-android-key .button');

      for(var i = 0; i< androidGameTitle.length; i++)
      {
        androidgame = {};
        androidgame.title = androidGameTitle[i].innerText.replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
        androidgame.title_slug = rfsbundlescraper.utilities.convertToSlug(androidgame.title);
        androidgame.dllink = androidGameLink[i].href;

        rfsbundlescraper.bundle.androidgames.push(androidgame);
      }
    },

    cleanup : function()  {
      if(rfsbundlescraper.bundle.drmFreeGames.length == 0)
        delete rfsbundlescraper.bundle.drmFreeGames;
      if(rfsbundlescraper.bundle.musictracks.length == 0)
        delete rfsbundlescraper.bundle.musictracks;
      if(rfsbundlescraper.bundle.androidgames.length == 0)
        delete rfsbundlescraper.bundle.androidgames;
    },

    clickGiftImages: function()  {
      if(rfsbundlescraper.utilities.giftLinks.length > 0)
      {
        var interval = setInterval(function()
        {
          if(rfsbundlescraper.utilities.giftLinks.length == 0)
          {
            clearInterval(interval);
          }
          else
          {
            rfsbundlescraper.utilities.giftLinks = $('#icon-gift img');
            rfsbundlescraper.utilities.giftLinks[0].click();
            rfsbundlescraper.utilities.giftLinks[0].remove();
            console.log('removing img');
          }
        }, 2000);
      }
      else
      {
        console.log('No gift images to click... continue on...');
      }
    }

  },

  humblebundle: {

    hb_init: function(){
      console.log('detected Humble Bundle');
    },

    hb_run: function(){
      this.hb_init();
    }
  }
};

rfsbundlescraper.run();
