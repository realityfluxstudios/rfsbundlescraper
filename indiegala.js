var VERSION = '0.8121700';

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

    console.log('rfsSettingsTextHeight: ' + localStorage.getItem('rfsSettingsTextHeight'));
    console.log('rfsSettingsTextWidth: ' + localStorage.getItem('rfsSettingsTextWidth'));
    console.log('rfsSettingsAutoClick: ' + localStorage.getItem('rfsSettingsAutoClick'));

    var cssString = "height: " + textHeight.val() + "px !important; width: " + textWidth.val() + "px !important";

    textArea.css('cssText', cssString);

  },

  loadSettings: function(){
    if(localStorage.getItem('rfsSettingsTextHeight') != null){
      $('#rfsSettingsTextHeight').val(localStorage.getItem('rfsSettingsTextHeight'));
      $('#rfsSettingsTextWidth').val(localStorage.getItem('rfsSettingsTextWidth'));
      $('#rfsSettingsAutoClick').prop('checked', localStorage.getItem('rfsSettingsAutoClick'))
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
      $('<script>').attr('src', src + "?" + this.cacheBuster).appendTo('head');
      this.oldCacheBuster = this.cacheBuster;
      console.log(this.oldCacheBuster);
      this.firstReload = false;
    }
    else {
      this.cacheBuster = Date.now().toString();
      $('script[src="' + src + '?' + this.oldCacheBuster + '"]').remove();
      $('<script>').attr('src', src + "?" + this.cacheBuster).appendTo('head');
      this.oldCacheBuster = this.cacheBuster;
    }
  }
};

var RFSGameInfoGathering = {

  combiner: false,
  exists: false,
  debug : true,
  bundle : {},

  init : function(){

    settings.loadSettings();

    console.log("RFS Game Info Gather Bookmarklet v" + VERSION);

    if($('#rfs-container').length == 0)
      $('body').append('<div id="rfs-container" style="position:fixed;bottom:10px;right:10px;z-index:1000;">\n    <div id="rfsSettings" style="color:#f5f5f5;">\n        Height: <input onBlur="settings.updateSettings()" type="text" id="rfsSettingsTextHeight" style="width:50px" value="408">\n        Width: <input onBlur="settings.updateSettings()" type="text" id="rfsSettingsTextWidth" style="width:50px" value="415">\n        Auto Click Gift Links: <input onChange="settings.updateSettings()" id="rfsSettingsAutoClick" type="checkbox" checked="checked">\n    </div>\n    \n    <button onClick="settings.toggleSettingsDisplay()" id="rfsSettingsBtn" class="btn-info">Settings</button>\n    <button class="btn-warning" onClick="settings.reloadScript();">Reload Script</button>\n    <button class="btn-danger" onClick="RFSGameInfoGathering.resetAndClear();">Reset and Clear</button>\n    <button class="btn-danger pull-right" onClick="RFSGameInfoGathering.close();">Close</button>\n     <br /> \n    <textarea onClick="this.select()" id="rfs-games-list" spellcheck="false" style="width: 415px; height: 408px !important"></textarea> \n</div>');

    if(localStorage.getItem('RFSIGBundle') != null)
    {
      this.combine = true;
      console.log('Loading existing bundle');
      this.readFromLS();
      this.bundle = JSON.parse(localStorage.getItem('RFSIGBundle'));
      console.log('bundle.games.length: ' + this.bundle.games.length);
      this.bundle.name = $('.color-text').text();
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
    var drm;

    /*
        The index `i` is based on the order of the items on the page.
        As of right now Desura is always listed at the top of the list
        followed by Steam games. I am _taking this for granted_. If they change
        this, it will break.
    */

    var steamLinkIndex = 0;

    for(var i = 0; i < titles.length; i++)
    {
      var game, key;

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

      var otherKeys = $('.keys');
      var steamLinks = $('.keyfield a');
      var smalltits2 = $('.small-tits2');

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

      game.keys.push(key);
      game.title = titles[i].text;
      game.title_slug = this.convertToSlug(game.title) + '-' + game.drm.toLowerCase();
      game.store_url = titles[i].href;

      if(this.combine)
      {
        this.bundle.games[i] = game;
      } else {
        this.bundle.games.push(game);
      }
    }

    this.removeDupes(this.bundle.games);
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

  run : function(){
    this.init();

    do{
      if(settings.giftLinks.length >= 1 && settings.interval == 0 && localStorage.getItem('rfsSettingsAutoClick') == true){
        this.clickGiftImages();
      }
    }while(settings.giftLinks.length > 0 && settings.interval != 0 && settings.autoClick);

    if(!this.exists){
      this.gatherDRMGames();
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
    this.resetAndClear();
    $('#rfs-container').remove();
  }
};

RFSGameInfoGathering.run();