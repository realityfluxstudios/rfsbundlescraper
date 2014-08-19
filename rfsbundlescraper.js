var VERSION = '0.8191720';

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

    appendText: function(value){
      $('#rfs-games-list').val( $('#rfs-games-list').val() + value);
    },

    add_floating_textarea: function (){
      $('body').append('<div id="rfs-container" style="position:fixed;bottom:10px;right:10px;z-index:1000;">\n    <div id="rfsSettings" style="color:#f5f5f5;background: black; display:none">\n        Height: <input onBlur="rfsbundlescraper.utilities.updateSettings()" type="text" id="rfsSettingsTextHeight" style="width:50px" value="408">\n        Width: <input onBlur="rfsbundlescraper.utilities.updateSettings()" type="text" id="rfsSettingsTextWidth" style="width:50px" value="415">\n    </div>\n    <button onClick="rfsbundlescraper.utilities.toggleSettingsDisplay()" id="rfsSettingsBtn" class="btn-info">Settings</button>\n    <button style="color: #fff;background-color: #f0ad4e;border-color: #eea236;" onClick="rfsbundlescraper.utilities.reloadScript();">Reload</button>\n    <button style="color: #fff;background-color: #5bc0de;border-color: #46b8da;" onClick="rfsbundlescraper.utilities.readFromLS();">Load</button>\n    <button style="color: #333;background-color: #fff;border-color: #ccc;" onClick="rfsbundlescraper.indiegala.clickGiftImages();" id="ig_autoclick_btn">Auto Click</button>\n    <button style="color: #333;background-color: #fff;border-color: #ccc;" onClick="rfsbundlescraper.humblebundle.clickGiftImages();" id=hb_autoclick_btn">Auto \n        Click</button>\n    <button style="color: #fff; float: right !important;background-color: #d9534f;border-color: #d43f3a;" onClick="rfsbundlescraper.utilities.close();">X</button>\n    <button style="color: #fff; float: right !important;background-color: #d9534f;border-color: #d43f3a;" onClick="rfsbundlescraper.utilities.resetAndClear();">Reset/Clear</button>\n     <br />\n    <div id="rfsbundlescraper-version" style="position:fixed;bottom: 1px;z-index:1500;width:415px;-webkit-user-select: none;">\n        RFS Bundle Scraper Bookmarklet v' + VERSION +'\n    </div><textarea onClick="this.select()" id="rfs-games-list" spellcheck="false" style="width: 415px; height: 408px !important; margin-bottom: 10px;"></textarea> \n    \n</div>');
    },

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
      var textArea = $('#rfs-games-list');

      localStorage.setItem('rfsSettingsTextHeight', textHeight.val());
      localStorage.setItem('rfsSettingsTextWidth', textWidth.val());

      var cssString = "height: " + textHeight.val() + "px !important; width: " + textWidth.val() + "px !important";

      textArea.css('cssText', cssString);
    },

    loadSettings: function(){
      if(localStorage.getItem('rfsSettingsTextHeight') != null)
      {
        $('#rfsSettingsTextHeight').val(localStorage.getItem('rfsSettingsTextHeight'));
        $('#rfsSettingsTextWidth').val(localStorage.getItem('rfsSettingsTextWidth'));
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
      $('#rfs-games-list').val('');
      this.appendText("Local Storage Cleared");
    },

    close : function()
    {
      $('#rfs-container').remove();
    },

    convertToSlug : function (value){
      return value.toLowerCase()
        .replace(/-+/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-');
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

    appendText: function(value){
      rfsbundlescraper.utilities.appendText(value);
    },

    ig_init : function(){

      rfsbundlescraper.utilities.loadSettings();

      console.log("RFS Bundle Scraper Bookmarklet v" + VERSION);

      if($('#rfs-container').length == 0)
        rfsbundlescraper.utilities.add_floating_textarea();

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

      rfsbundlescraper.utilities.readFromLS();
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

    hblibrary   :   [],
    titles      :   $('div.gameinfo div.title a'),
    subtitles   :   $('div.gameinfo div.subtitle a'),
    icons       :   $('div.icn'),
    windls      :   $('div.js-platform.downloads.windows div.download-buttons'),
    macdls      :   $('div.js-platform.downloads.mac div.download-buttons'),
    linuxdls    :   $('div.js-platform.downloads.linux div.download-buttons'),
    androiddls  :   $('div.js-platform.downloads.android div.download-buttons'),
    audiodls    :   $('div.js-platform.downloads.audio div.download-buttons'),
    ebookdls    :   $('div.js-platform.downloads.ebook div.download-buttons'),
    comedydls   :   $('div.js-platform.downloads.comedy div.download-buttons'),

    appendText: function(value){
      rfsbundlescraper.utilities.appendText(value);
    },

    hb_init: function(){
      console.log('detected Humble Bundle');
      rfsbundlescraper.utilities.loadSettings();

      console.log("RFS Bundle Scraper Bookmarklet v" + VERSION);

      if($('#rfs-container').length == 0)
      {
        rfsbundlescraper.utilities.add_floating_textarea();
        $('#ig_autoclick_btn').hide();
      }
    },

    hb_run: function(){
      this.hb_init();
    },

    run: function(){
      for(var i = 0; i < this.titles.length; i++)
      {
        var title     = this.titles[i];
        var subtitle  = this.subtitles[i];
        var icon      = this.icons[i];
        var windl     = this.windls[i];
        var macdl     = this.macdls[i];
        var linuxdl   = this.linuxdls[i];
        var androiddl = this.androiddls[i];
        var audiodl   = this.audiodls[i];
        var ebookdl   = this.ebookdls[i];
        var comedydl  = this.comedydls[i];

        var item = {};

        item.title = title.text.trim();
        item.developer = subtitle.text.trim();
        item.url = subtitle.attributes['href']['value'];
        item.icon = icon.children[0].children[0].attributes['src']['value'];

        item.platforms = [];

        console.log(i + ". " + item.title);

        var thisPlatform = {};

        item = this.process(item, thisPlatform, windl, "Windows");
        item = this.process(item, thisPlatform, macdl, "Mac");
        item = this.process(item, thisPlatform, linuxdl, "Linux");
        item = this.process(item, thisPlatform, androiddl, "Android");
        item = this.process(item, thisPlatform, audiodl, "Audio");
        item = this.process(item, thisPlatform, comedydl, 'Comedy');
        item = this.process(item, thisPlatform, ebookdl, 'eBook');

        this.hblibrary.push(item);
      }
      $('#games-list-text').val(JSON.stringify(this.hblibrary, null, 2));
    },

    init: function (){
      this.hblibrary = [];

      $('div#games-list').remove();

      $('h1:nth-child(2)').append('<div id="games-list"><textarea onClick="this.select();" id="games-list-text" rows="25" cols="950" style="width:900px"></textarea></div>');
    },

    process: function(item, platform, platformdl, type){

      if(type === "Windows")
        platform.windows = [];
      else if(type === "Mac")
        platform.mac = [];
      else if(type === "Linux")
        platform.linux = [];
      else if(type === "Audio")
        platform.audio = [];
      else if(type === "Android")
        platform.android = [];
      else if(type === "Comedy")
        platform.comedy = [];
      else if(type === "eBook")
        platform.ebook = [];

      if(platformdl.children.length > 0){
        for(var j=0; j <= platformdl.children.length-1; j++)
        {
          if(platformdl.children[j].className !== "custom-download-text")
          {
            var info  = {};
            info.platform = type;

            if( platformdl.children[j].children[0].childElementCount > 0)
              info.type = platformdl.children[j].children[0].children[1].innerHTML;
            if( platformdl.children[j].children[1].children[0].childElementCount > 0)
              info.size = platformdl.children[j].children[1].children[0].children[0].innerHTML;

            var dllinks = platformdl.children[j].children[0].children[2];

            if(dllinks.hasAttribute('data-web'))
              info.http = dllinks.attributes['data-web']['value'];

            if(dllinks.hasAttribute('data-bt'))
              info.bt   = dllinks.attributes['data-bt']['value'];

            if(platformdl.children[j].hasAttribute('data-md5'))
              info.hash = platformdl.children[j].attributes['data-md5']['value'];

            if(type == "Windows")
              platform.windows.push(info);
            else if(type == "Mac")
              platform.mac.push(info);
            else if(type == "Linux")
              platform.linux.push(info);
            else if(type == "Audio")
              platform.audio.push(info);
            else if(type == "Android")
              platform.android.push(info);
            else if(type == "Comedy")
              platform.comedy.push(info);
            else if(type == "eBook"){
              platform.ebook.push(info);
              item.platforms.push(platform);
            }
            //platform.push(info);
          }
        }
      }

      return item;
    },

    clickGiftImages: function(){

    }
  }
};

rfsbundlescraper.run();
