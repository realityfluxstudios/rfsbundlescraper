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
    if(localStorage.getItem('rfs.IGBundle') != null)
    {
      this.combine = true;
      this.debuglog('Loading existing bundle');
      this.bundle = JSON.parse(localStorage.getItem('rfs.IGBundle'));
      this.debuglog('bundle.games.length: ' + this.bundle.games.length);

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
    if($('#games-list').length == 0)
      $('#indie_gala_2 h2').append('<div class="container" id="games-list" style="text-align: center;"> <div class="row"> <div class="span4">' +
                                   '<button onClick="rfsigbundle.reset();" type="button" class="btn btn-danger">Clear Local Storage</button>' +
                                   '<button onClick="rfsigbundle.run();" type="button" class="btn btn-primary">Run</button>' +
                                   '<button onClick="rfsigbundle.fillGamesList();" type="button" class="btn btn-info">Load from Local Storage</button> ' +
                                   '</div> <div class="row"> <div class="span12"> <textarea onClick="this.select();" id="games-list-text" rows="25" cols="950" style="width:900px"></textarea> </div> </div> </div></div>');
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


      } else {
        game = {};
        game.keys = [];
        key = {};
        key.gift_url = window.location.href;
        drm = titles[i].href;
      }

      var otherKeys = $('.keys');
      var steamLinks = $('.keyfield a');

      if(drm.match('desura') || ( i < $('.small-tits2').length && $('.small-tits2')[i].text.match(/desura/i)))
      {
        game.drm = 'Desura';
        key.key = otherKeys[i].value;
      }
      else if(drm.match('origin'))
      {
        game.drm = 'Origin';
        key.key = otherKeys[i].value;
      }
      else if(drm.match('steam'))
      {
        game.drm = 'Steam';

        key.key = steamLinks[steamLinkIndex].href;

        steamLinkIndex++;
      }
      else if(drm.match('gamersgate'))
      {
        game.drm = 'GamersGate';
        key.key = otherKeys[i].value;
      }
      else if(drm.match('gog'))
      {
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
    this.fillGamesList();
  },

  fillGamesList: function(){
    if(this.bundle != null || this.bundle != undefined)
      $('#games-list-text').val( JSON.stringify(this.bundle, null, 2));
    else
      $('#games-list-text').val('No Bundle in Local Storage');
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
    /*this.init();*/

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
    localStorage.setItem('rfs.IGBundle', JSON.stringify(this.bundle, null, 2));
    $('#games-list-text').val( JSON.stringify(this.bundle, null, 2));
  },

  debuglog: function(text){
    if(this.debug)
      console.log('debug: ' + text);
  },

  removeFromLS: function(){
    localStorage.removeItem('rfs.IGBundle');
    this.bundle = {};
    console.log('this.bundle: ' + JSON.stringify(this.bundle, null, 2));
    console.log('this.bundle.games: ' + JSON.stringify(this.bundle.games, null, 2));
  },

  reset : function(){
    combiner = false;
    exists = false;
    debug = true;
    this.removeFromLS();
  }
}

rfsigbundle.run();
