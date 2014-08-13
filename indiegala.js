var VERSION = '0.8140020';

var settings = {
  interval : 0,
  giftLinks : $('#icon-gift img'),
  cacheBuster: 0,
  oldCacheBuster: 0,
  firstReload: true,

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

      $('#rfsSettingsTextHeight').val(localStorage.getItem('rfsSettingsTextHeight'));
      $('#rfsSettingsTextWidth').val(localStorage.getItem('rfsSettingsTextWidth'));
      if(checked)
        $('#rfsSettingsAutoClick').prop('checked', true).click();
      else
        $('#rfsSettingsAutoClick').prop('checked', false).click();
    } else {
      var textHeight = $('#rfsSettingsTextHeight');
      var textWidth = $('#rfsSettingsTextWidth');
      var textArea = $('#rfs-games-list');

      textArea.height(textHeight.val());
      textArea.width(textWidth.val());
    }
  },

  reloadScript: function(){
    var src = "https://raw.githack.com/tvl83/GameBundleInfoHarvester/master/indiegala.js";

    $('#rfs-container').remove();

    if(this.firstReload){
      this.cacheBuster = Date.now().toString();
      console.log(this.cacheBuster);
      $('script[src="' + src + '"]').remove();
      $('<script>').attr('src', src + "?" + this.cacheBuster).appendTo('body');
      this.oldCacheBuster = this.cacheBuster;
      console.log(this.oldCacheBuster);
      this.firstReload = false;
    }
    else {
      this.cacheBuster = Date.now().toString();
      $('script[src="' + src + '?' + this.oldCacheBuster + '"]').remove();
      $('<script>').attr('src', src + "?" + this.cacheBuster).appendTo('body');
      this.oldCacheBuster = this.cacheBuster;
    }
  }
};

var RFSGameInfoGathering = {

  combiner: false,
  exists: false,
  debug : true,
  bundle : {
    games: []
  },

  init : function(){

    settings.loadSettings();

    console.log("RFS Game Info Gather Bookmarklet v" + VERSION);

    if($('#rfs-container').length == 0)
      $('body').append('<div id="rfs-container" style="position:fixed;bottom:10px;right:10px;z-index:1000;">\n    <div id="rfsSettings" style="color:#f5f5f5;display:none">\n        Height: <input onBlur="settings.updateSettings()" type="text" id="rfsSettingsTextHeight" style="width:50px" value="408">\n        Width: <input onBlur="settings.updateSettings()" type="text" id="rfsSettingsTextWidth" style="width:50px" value="415">\n        Auto Click Gift Links: <input onChange="settings.updateSettings()" id="rfsSettingsAutoClick" type="checkbox" checked="checked">\n    </div>\n    \n    <button onClick="settings.toggleSettingsDisplay()" id="rfsSettingsBtn" class="btn-info">Settings</button>\n    <button class="btn-warning" onClick="settings.reloadScript();">Reload Script</button>\n    <button class="btn-danger" onClick="RFSGameInfoGathering.resetAndClear();">Reset and Clear</button>\n    <button class="btn-danger pull-right" onClick="RFSGameInfoGathering.close();">Close</button>\n     <br /> \n    <textarea onClick="this.select()" id="rfs-games-list" spellcheck="false" style="width: 415px; height: 408px !important"></textarea> \n</div>');

    if(localStorage.getItem('RFSIGBundle') != null)
    {
      this.combine = true;
      console.log('Loading existing bundle');
      this.readFromLS();
      this.bundle = JSON.parse(localStorage.getItem('RFSIGBundle'));
      console.log('bundle.games.length: ' + this.bundle.games.length);
      this.bundle.name = $('.text_align_center h2')[0].innerText;
      this.bundle.site = "IndieGala";

      if(this.bundle.url === window.location.href)
      {
        console.log("this.bundle.url: " + this.bundle.url + " === window.location.href: " + window.location.href);
        this.exists = true;
      }
    }
    else {
      console.log('No existing bundle...');
      this.bundle.name = $('.color-text').text();
      this.bundle.site = "IndieGala";
    }
  },

  convertToSlug : function (value){
    return value.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
  },

  removeDupes : function (list){
    var unique = [];
    $.each(list, function(i, el){
      if($.inArray(el, unique) === -1) {
        unique.push(el);
      }
    });
    return unique;
  },

  gatherDRMGames : function(){
    //var gameRow = $('#stringa-game-key .row');

    var titles = $('.title_game a');
    var drm, game, key;

    /*
        The index `i` is based on the order of the items on the page.
        As of right now Desura is always listed at the top of the list
        followed by Steam games. I am _taking this for granted_. If they change
        this, it will break.
    */

    var steamLinkIndex = 0;

    var otherKeys = $('.keys');
    var steamLinks = $('.keyfield a');
    var smalltits2 = $('.small-tits2');

    if(steamLinks.length != 0)
    {
      console.log('New Bundle Type');
      console.log('number of games: ' + titles.length);

      for(var i = 0; i < titles.length; i++)
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
          if(!this.combine)
            game.drm = 'Desura';
          key.key = otherKeys[i].value;
        }
        else if(drm.match(/origin/))
        {
          if(!this.combine)
            game.drm = 'Origin';
          key.key = otherKeys[i].value;
        }
        else if(drm.match(/steam/))
        {
          if(!this.combine)
            game.drm = 'Steam';
          key.key = steamLinks[steamLinkIndex].href;
          steamLinkIndex++;
        }
        else if(drm.match(/gamersgate/))
        {
          if(!this.combine)
            game.drm = 'GamersGate';
          key.key = otherKeys[i].value;
        }
        else if(drm.match(/gog/))
        {
          if(!this.combine)
            game.drm = 'GOG';
          key.key = otherKeys[i].value;
        }
        game.title = titles[i].text;
        game.title_slug = this.convertToSlug(game.title) + '-' + game.drm.toLowerCase();
        game.store_url = titles[i].href;

        game.keys.push(key);

        if(this.combine)
        {
          this.bundle.games[i] = game;
        } else {
          this.bundle.games.push(game);
        }
      }
    } else {
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
        } else {
          game = {};
          game.keys = [];
        }

        key = {};

        console.log(titlesOldBundles[i].innerText);

        drm = titlesOldBundles[i].href;
        if(drm.match('desura'))
          drm = 'Desura';
        else if(drm.match('origin'))
          drm = 'Origin';
        else if(drm.match('steam'))
          drm = 'Steam';
        else if(drm.match('gamersgate'))
          drm = 'GamersGate';
        else if(drm.match('gog'))
          drm = 'GOG';

        game.title = titlesOldBundles[i].innerText;
        game.store_url = drm;
        key.key = keys[i].value;
        key.url = window.location.href;

        game.keys.push(key);

        if(this.combine)
        {
          this.bundle.games[i] = game;
        } else {
          this.bundle.games.push(game);
        }
      }
    }

    this.removeDupes(this.bundle.games);
//    for(var j = 0; j < this.bundle.games.length-1; j++)
//    {
//      this.removeDupes(this.bundle.games[j].keys);
//    }
//    this.removeDupes(this.bundle.games);
    this.readFromLS();
  },

  readFromLS: function(){
    if(this.bundle != null || this.bundle != undefined)
      $('#rfs-games-list').val( JSON.stringify(this.bundle, null, 2));
    else
      $('#rfs-games-list').val('No Bundle in Local Storage');
  },

  clickGiftImages: function(){
    if(settings.giftLinks.length > 0){
      var interval = setInterval(function(){
        if(settings.giftLinks.length == 0){
          clearInterval(interval);
        } else {
          settings.giftLinks = $('#icon-gift img');
          settings.giftLinks[0].click();
          settings.giftLinks[0].remove();
          console.log('removing img');
        }
      }, 2000);
    } else {
      console.log('No gift images to click... continue on...');
    }
  },

  gatherDRMFreeGames: function(){
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
      drmFreeGame.platform = drmFreeGamesPlatforms[i].innerText;
      drmFreeGame.dllink = drmFreeGamesDLLink[i].href;

      this.bundle.drmFreeGames.push(drmFreeGame);
    }
  },

  gatherMusicTracks: function(){

    this.bundle.musictracks = [];
    var musictrack = {};

    var musicTracks = $('#music #stringa-music-key');
    var musicTitles = $('#music #stringa-music-key .title_music');
    var musicDev = $('#music #stringa-music-key .title_dev');

    for(var i = 0; i < musicTracks.length; i++)
    {
      /* forgive the magic numbers in the arrays. they are necessary to drill down to the location of the given required information */
      var MP3DLLink = $('#music .span-keys')[i].children[0].children[0].children[0].href;
      var MP3DLLinkText = $('#music .span-keys')[i].children[0].children[0].children[1].innerText;

      var FLACDLLink = $('#music .span-keys')[i].children[1].children[0].children[0].href;
      var FLACDLLinkText = $('#music .span-keys')[i].children[1].children[0].children[1].innerText;

      musictrack.title = musicTitles[i].innerText.replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
      musictrack.dev = musicDev[i].innerText.replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');

      musictrack.mp3dllink = MP3DLLink;
      musictrack.mp3type = MP3DLLinkText;
      musictrack.flacdllink = FLACDLLink;
      musictrack.flactype = FLACDLLinkText;

      this.bundle.musictracks.push(musictrack);
    }
  },
  gatherAndroidGames: function(){

    this.bundle.androidgames = [];
    var androidgame = {};

    var androidGameTitle = $('#android #stringa-android-key .title_game');
    var androidGameLink = $('#android #stringa-android-key .button');

    for(var i = 0; i< androidGameTitle.length; i++)
    {
      androidgame.title = androidGameTitle[i].innerText.replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
      androidgame.dllink = androidGameLink[i].href;

      this.bundle.androidgames.push(androidgame);
    }
  },
  run : function(){
    this.init();

    do{
      if(settings.giftLinks.length >= 1 && settings.interval == 0 && localStorage.getItem('rfsSettingsAutoClick') == true){
        this.clickGiftImages();
      }
    }while(settings.giftLinks.length > 0 && settings.interval != 0 && settings.autoClick);

    if(!this.exists){
      this.gatherDRMGames();
      this.gatherDRMFreeGames();
      this.gatherMusicTracks();
      this.gatherAndroidGames();

      this.removeDupes(this.bundle.games);
      this.saveToLS();
    } else {
      console.log('It\'s the same bundle dude!');
    }

    this.readFromLS();
  },

  saveToLS: function(){
    localStorage.setItem('RFSIGBundle', JSON.stringify(this.bundle, null, 2));
    this.readFromLS();
  },

  removeFromLS: function(){
    localStorage.removeItem('RFSIGBundle');

    localStorage.removeItem('rfsSettingsTextHeight');
    localStorage.removeItem('rfsSettingsTextWidth');
    localStorage.removeItem('rfsSettingsAutoClick');

    this.bundle = {};
    console.log('this.bundle: ' + JSON.stringify(this.bundle, null, 2));
    console.log('this.bundle.games: ' + JSON.stringify(this.bundle.games, null, 2));
    this.readFromLS();

  },

  resetAndClear : function(){
    this.combiner = false;
    this.exists = false;
    this.debug = true;

    settings.textHeight = 408;
    settings.textWidth = 415;
    settings.autoClick = true;

    this.removeFromLS();

  },

  close : function(){
    $('#rfs-container').remove();
  }
};

RFSGameInfoGathering.run();