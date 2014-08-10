var VERSION = '0.8102211';

var settings = {
  interval : 0,
  giftLinks : $('#icon-gift').find('img')
};

var RFSGameInfoGathering = {

  combiner: false,

  exists: false,

  debug : true,

  bundle : {
    name : '',
    url : window.location.href,
    site : '',
    games : [],
    drm_free : [],
    music_tracks : [],
    android_games : []
  },

  init : function(){

    console.log("RFS Game Info Gather Bookmarklet v" + VERSION);

    if($('#rfs-container').length == 0)
      $('body').append('<div id="rfs-container" style="position:fixed;bottom:10px;right:10px;z-index:1000;">\n    <button class="btn-warning" onClick="reloadScript();">Reload Script</button> \n    <button class="btn-info" onClick="RFSGameInfoGathering.readFromLS();">Print From LS</button> \n    <button class="btn-danger" onClick="RFSGameInfoGathering.resetAndClear();">Reset and Clear LS</button> \n     <br /> \n    <textarea id="rfs-games-list" spellcheck="false" style="width: 415px; height: 408px!important;"></textarea> \n    <span id="rfs-handle" style="border-width: 8px; border-style: solid;border-color: #fff transparent transparent #fff;position: absolute;top: 0;left: 0;opacity: .1;cursor: nw-resize;"> </span>\n</div>');

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
    var gameRow = $('#stringa-game-key').find('.row');

    var titles = $('.title_game a');
    var drm;

    /*
        The index `i` is based on the order of the items on the page.
        As of right now Desura is always listed at the top of the list
        followed by Steam games. I am _taking this for granted_. If they change
        this, it will break.
    */

    var steamLinkIndex = 0;

    for(var i = 0; i < titles.length-1; i++)
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

      if(drm.match('desura') || ( i < smalltits2.length && smalltits2[i].text.match(/desura/i)))
      {
        if(!this.combine)
          game.drm = 'Desura';
        key.key = otherKeys[i].value;
      }
      else if(drm.match('origin'))
      {
        if(!this.combine)
          game.drm = 'Origin';
        key.key = otherKeys[i].value;
      }
      else if(drm.match('steam'))
      {
        if(!this.combine)
          game.drm = 'Steam';

        key.key = steamLinks[steamLinkIndex].href;

        steamLinkIndex++;
      }
      else if(drm.match('gamersgate'))
      {
        if(!this.combine)
          game.drm = 'GamersGate';
        key.key = otherKeys[i].value;
      }
      else if(drm.match('gog'))
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
          settings.giftLinks = $('#icon-gift').find('img');
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
      if(settings.giftLinks.length >= 1 && settings.interval == 0){
        this.clickGiftImages();
      }
    }while(settings.giftLinks.length > 0 && settings.interval != 0);

    if(!this.exists){
      this.gatherDRMGames();
      this.removeDupes(this.bundle.games);
      this.saveToLS();
    } else {
      console.log('It\'s the same bundle dude!');
    }
  },

  saveToLS: function(){
    localStorage.setItem('RFSIGBundle', JSON.stringify(this.bundle, null, 2));
    this.readFromLS();
  },

  debugLog: function(text){
    if(this.debug)
      console.log('debug: ' + text);
  },

  removeFromLS: function(){
    localStorage.removeItem('RFSIGBundle');
    this.bundle = {};
    console.log('this.bundle: ' + JSON.stringify(this.bundle, null, 2));
    console.log('this.bundle.games: ' + JSON.stringify(this.bundle.games, null, 2));
    this.readFromLS();
  },

  resetAndClear : function(){
    combiner = false;
    exists = false;
    debug = true;
    this.removeFromLS();
    this.readFromLS();
  }
};

function reloadScript() {
  var src = "https://rawgit.com/tvl83/GameBundleInfoHarvester/master/indiegala.js";
  $('script[src="' + src + '"]').remove();
  $('<script>').attr('src', src).appendTo('head');
}

RFSGameInfoGathering.run();
