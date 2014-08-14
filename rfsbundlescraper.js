var VERSION = '0.8142010';

var settings = {
  interval : 0,
  giftLinks : $('#icon-gift img'),
  cacheBuster: 0,
  oldCacheBuster: 0,
  firstReload: true,
  rfsSettingsTextHeight: 400,
  rfsSettingsTextWidth: 315,
  rfsSettingsAutoClick: true,

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
    var src;
    src = "https://raw.githack.com/tvl83/GameBundleScraper/master/rfsbundlescraper.js";

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
  }
};

var rfsbundlescraper = {

  combiner: false,
  exists: false,
  debug : true,
  bundles: [],
  bundle : {
    name: '',
    name_slug: '',
    site: '',
    games: []
  },

  init : function(){

    settings.loadSettings();

    console.log("RFS Bundle Scraper Bookmarklet v" + VERSION);

    if($('#rfs-container').length == 0)
      $('body').append('<div id="rfs-container" style="position:fixed;bottom:10px;right:10px;z-index:1000;">\n    <div id="rfsSettings" style="color:#f5f5f5;display:none">\n        Height: <input onBlur="settings.updateSettings()" type="text" id="rfsSettingsTextHeight" style="width:50px" value="408">\n        Width: <input onBlur="settings.updateSettings()" type="text" id="rfsSettingsTextWidth" style="width:50px" value="415">\n        Auto Click Gift Links: <input onChange="settings.updateSettings()" id="rfsSettingsAutoClick" type="checkbox" checked="checked">\n    </div>\n    \n    <button onClick="settings.toggleSettingsDisplay()" id="rfsSettingsBtn" class="btn-info">Settings</button>\n    <button class="btn-warning" onClick="settings.reloadScript();">Reload Script</button>\n    <button class="btn-danger" onClick="rfsbundlescraper.resetAndClear();">Reset and Clear</button>\n    <button class="btn-danger pull-right" onClick="rfsbundlescraper.close();">Close</button>\n     <br /> \n    <textarea onClick="this.select()" id="rfs-games-list" spellcheck="false" style="width: 415px; height: 408px !important"></textarea> \n</div>');

    if(localStorage.getItem('RFSIGBundle') != null)
    {
      this.combine = true;
      console.log('Loading existing bundle');
      this.readFromLS();
      this.bundle = JSON.parse(localStorage.getItem('RFSIGBundle'));
      console.log('bundle.games.length: ' + this.bundle.games.length);

      if(this.bundle.url === window.location.href)
      {
        console.log("this.bundle.url: " + this.bundle.url + " === window.location.href: " + window.location.href);
        this.exists = true;
      }
    }
    else {
      console.log('No existing bundle...');
    }

    this.bundle.name = $('.text_align_center h2')[0].innerText;
    this.bundle.name_slug = this.convertToSlug(this.bundle.name);
    this.bundle.site = "IndieGala";
  },

  convertToSlug : function (value){
    return value.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
  },

  oldRemoveDupes : function (list)
  {
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

  /* this is just a temp solution. any input is welcome! :) */
  removeDupes : function(arr, print)
  {
    for(var i=0; i < arr.length-1; i++)
    {
      if(print)
      {
        console.log('arr[i] outer for loop');
        console.log(arr[i]);
      }
      for(var j=0; j < arr.length-1; j++)
      {
        if(print)
        {
          console.log('arr[j] INNER for loop');
          console.log(arr[j]);
        }
        if(arr[i].key === arr[j].key && i != j)
        {
          console.log('deleting...');
          console.log(arr[j]);
          delete arr[j];
        }
      }
    }
  },

  gatherDRMGames : function()
  {

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
        if(this.combine)
        {
          game = this.bundle.games[i];
          console.log('Combining ' + this.bundle.games[i].title);
        } else {
          game = {};
          game.keys = [];
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

        if(this.combine)
        {
          this.bundle.games[i] = game;
        }
        else
        {
          game.title = titles[i].text;
          game.title_slug = this.convertToSlug(game.title) + '-' + game.drm.toLowerCase();
          game.store_url = titles[i].href;
          this.bundle.games.push(game);
        }
      }
    }
    else
    {
      console.log('Old Bundle type');

      var titlesOldBundles = $('#steam-key #stringa-game-key .title_game a');

      var keys = $('.keys');

      for(i = 0; i < titlesOldBundles.length; i++)
      {
        if(this.combine)
        {
          game = this.bundle.games[i];
          console.log('Combining ' + this.bundle.games[i].title);
          console.log('i is ' + i);
        }
        else
        {
          game = {};
          game.keys = [];
        }

        key = {};

        console.log(titlesOldBundles[i].innerText);

        drm = titlesOldBundles[i].href;
        if(drm.match(/desura/))
          drm = 'Desura';
        else if(drm.match(/origin/))
          drm = 'Origin';
        else if(drm.match(/steam/))
          drm = 'Steam';
        else if(drm.match(/gamersgate/))
          drm = 'GamersGate';
        else if(drm.match(/gog/))
          drm = 'GOG';

        game.title = titlesOldBundles[i].innerText;
        game.title_slug = this.convertToSlug(game.title) + '-' + game.drm.toLowerCase();
        game.store_url = drm;

        key.key = keys[i].value;
        key.url = window.location.href;

        game.keys.push(key);

        if(this.combine)
        {
          this.bundle.games[i] = game;
        }
        else
        {
          this.bundle.games.push(game);
        }
      }
    }

    this.oldRemoveDupes(this.bundle.games);

    for(var z=0; z < this.bundle.games.length; z++)
    {
      this.oldRemoveDupes(this.bundle.games[z].keys);
    }

    this.readFromLS();
  },

  gatherDRMFreeGames: function()
  {
    var drmFreeGames = $('#drm-free-games #stringa-music-key');
    var drmFreeGamesTitles = $('#drm-free-games #stringa-music-key .title_game');
    var drmFreeGamesPlatforms = $('#drm-free-games #stringa-music-key .title_dev');
    var drmFreeGamesDLLink = $('#drm-free-games #stringa-music-key .button');

    this.bundle.drmFreeGames = [];
    var drmFreeGame;

    for(var i = 0; i < drmFreeGames.length; i++)
    {
      drmFreeGame = {};
      drmFreeGame.title = drmFreeGamesTitles[i].innerText.replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
      drmFreeGame.title_slug = this.convertToSlug(drmFreeGame.title);
      drmFreeGame.platform = drmFreeGamesPlatforms[i].innerText;
      drmFreeGame.dllink = drmFreeGamesDLLink[i].href;

      this.bundle.drmFreeGames.push(drmFreeGame);
    }
  },

  gatherMusicTracks: function()
  {

    this.bundle.musictracks = [];
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
      musictrack.title_slug = this.convertToSlug(musictrack.title);
      musictrack.dev = musicDev[i].innerText.replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
      musictrack.dev_slug = this.convertToSlug(musictrack.dev);

      musictrack.mp3dllink = MP3DLLink;
      musictrack.mp3type = MP3DLLinkText;
      musictrack.flacdllink = FLACDLLink;
      musictrack.flactype = FLACDLLinkText;

      this.bundle.musictracks.push(musictrack);
    }
  },

  gatherAndroidGames: function()
  {
    this.bundle.androidgames = [];
    var androidgame;

    var androidGameTitle = $('#android #stringa-android-key .title_game');
    var androidGameLink = $('#android #stringa-android-key .button');

    for(var i = 0; i< androidGameTitle.length; i++)
    {
      androidgame = {};
      androidgame.title = androidGameTitle[i].innerText.replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
      androidgame.title_slug = this.convertToSlug(androidgame.title);
      androidgame.dllink = androidGameLink[i].href;

      this.bundle.androidgames.push(androidgame);
    }
  },

  readFromLS: function()
  {
    if(this.bundle != null || this.bundle != undefined)
      $('#rfs-games-list').val( JSON.stringify(this.bundle, null, 2));
    else
      $('#rfs-games-list').val('No Bundle in Local Storage');
  },

  clickGiftImages: function()
  {
    if(settings.giftLinks.length > 0)
    {
      var interval = setInterval(function()
      {
        if(settings.giftLinks.length == 0)
        {
          clearInterval(interval);
        }
        else
        {
          settings.giftLinks = $('#icon-gift img');
          settings.giftLinks[0].click();
          settings.giftLinks[0].remove();
          console.log('removing img');
        }
      }, 2000);
    }
    else
    {
      console.log('No gift images to click... continue on...');
    }
  },

  run : function()
  {

    this.init();

    console.log('localStorage.getItem(\'rfsSettingsAutoClick\'): ' + localStorage.getItem('rfsSettingsAutoClick'));

    do
    {
      if(settings.giftLinks.length >= 1 &&
          settings.interval == 0 &&
            localStorage.getItem('rfsSettingsAutoClick') === 'true')
      {
        this.clickGiftImages();
      }
    }while(settings.giftLinks.length > 0 && settings.interval != 0);

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
      this.oldRemoveDupes(this.bundle.games);
      this.saveToLS();
    }
    else
    {
      console.log('It\'s the same bundle dude!');
    }

    this.readFromLS();
  },

  cleanup : function()
  {
    if(this.bundle.drmFreeGames.length == 0)
      delete this.bundle.drmFreeGames;
    if(this.bundle.musictracks.length == 0)
      delete this.bundle.musictracks;
    if(this.bundle.androidgames.length == 0)
      delete this.bundle.androidgames;
  },

  saveToLS : function()
  {
    localStorage.setItem('RFSIGBundle', JSON.stringify(this.bundle, null, 2));
    this.readFromLS();
  },

  removeFromLS : function()
  {
    localStorage.removeItem('RFSIGBundle');

    localStorage.removeItem('rfsSettingsTextHeight');
    localStorage.removeItem('rfsSettingsTextWidth');
    localStorage.removeItem('rfsSettingsAutoClick');

    this.bundle = {};
    console.log('this.bundle: ' + JSON.stringify(this.bundle, null, 2));
    console.log('this.bundle.games: ' + JSON.stringify(this.bundle.games, null, 2));
    this.readFromLS();
  },

  resetAndClear : function()
  {
    this.combiner = false;
    this.exists = false;
    this.debug = true;
    this.removeFromLS();
  },

  close : function()
  {
    $('#rfs-container').remove();
  }
};

rfsbundlescraper.run();