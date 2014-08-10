var settings = {
  interval : 0,
  giftLinks : $('#icon-gift img')
}

var rfsigbundle = {

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
    android_games : [],
  },

  init : function(){

    console.log("RFS Game Info Gather Bookmarklet v0.8102117")

    if($('#rfs-container').length == 0)
      $('body').append('<div id="rfs-container" style="position:fixed;bottom:10px;right:10px;z-index:1000;"> <button class="btn-default" onClick="rfsigbundle.run();">Run()</button> <button class="btn-info" onClick="rfsigbundle.readfromls();">Print From LS</button> <button class="btn-danger" onClick="rfsigbundle.resetandclear();">Reset and Clear LS</button> <br /> <textarea id="rfs-games-list" spellcheck="false" style="width: 415px; height: 408px!important;"></textarea> <span id="rfs-handle" style="border-width: 8px; border-style: solid;border-color: #fff transparent transparent #fff;position: absolute;top: 0;left: 0;opacity: .1;cursor: nw-resize;"> </span></div>');

    if(localStorage.getItem('RFSIGBundle') != null)
    {
      this.combine = true;
      this.debuglog('Loading existing bundle');
      this.readfromls();
      this.bundle = JSON.parse(localStorage.getItem('RFSIGBundle'));
      this.debuglog('bundle.games.length: ' + this.bundle.games.length);
      this.bundle.name = $('.color-text').text();
      this.bundle.site = "IndieGala";

      if(this.bundle.url === window.location.href)
      {
        console.log("this.bundle.url: " + this.bundle.url + " === window.location.href: " + window.location.href)
        this.exists = true;
      }
    }
    else {
      this.debuglog('No existing bundle...')
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
    var gameRow = $('#stringa-game-key .row');

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
        this.debuglog('Combining ' + this.bundle.games[i].title);
      } else {
        game = {};
        game.keys = [];
        key = {};
        key.gift_url = window.location.href;

      }

      drm = titles[i].href;

      var otherKeys = $('.keys');
      var steamLinks = $('.keyfield a');

      if(drm.match('desura') || ( i < $('.small-tits2').length && $('.small-tits2')[i].text.match(/desura/i)))
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
    this.readfromls();
  },

  readfromls: function(){
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
      this.debuglog('No gift images to click... continue on...');
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
      this.debuglog('It\'s the same bundle dude!');
    }
  },

  saveToLS: function(){
    localStorage.setItem('RFSIGBundle', JSON.stringify(this.bundle, null, 2));
    $('#rfs-games-list').val( JSON.stringify(this.bundle, null, 2));
  },

  debuglog: function(text){
    if(this.debug)
      console.log('debug: ' + text);
  },

  removeFromLS: function(){
    localStorage.removeItem('RFSIGBundle');
    this.bundle = {};
    console.log('this.bundle: ' + JSON.stringify(this.bundle, null, 2));
    console.log('this.bundle.games: ' + JSON.stringify(this.bundle.games, null, 2));
  },

  resetandclear : function(){
    combiner = false;
    exists = false;
    debug = true;
    this.removeFromLS();
  }
}

function reloadscript() {
  var src = "https://raw.githubusercontent.com/tvl83/GameBundleInfoHarvester/master/indiegala.js";
  $('script[src="' + src + '"]').remove();
  $('<script>').attr('src', src).appendTo('head');
}

rfsigbundle.run();
