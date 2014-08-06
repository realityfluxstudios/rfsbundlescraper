
/*
  if($('#steam-key :nth-child(2) .title_game a').attr('href') !== undefined){
    for(var i = 2; i < 100; i++  ){
      var keys = [];
      if($('#steam-key :nth-child(' + i + ') .title_game a').attr('href') === undefined){
        i = 1000;
      } else {

        var game = {};
        var key = {};
        var url = window.location.href;
        key.gift_url = url;
        drm = $('#steam-key :nth-child(' + i + ').title_game a').attr('href');
        if(drm.match('desura'))
          game.drm = 'Desura';
        else if(drm.match('origin'))
          game.drm = 'Origin';
        else if(drm.match('steam'))
          game.drm = 'Steam';
        else if(drm.match('gamersgate'))
          game.drm = 'GamersGate';
        else if(drm.match('gog'))
          game.drm = 'GOG';

        game.title = $('#steam-key :nth-child(' + i + ') .title_game a').text();
        game.title_slug = convertToSlug(game.title);
        game.store_url = $('#steam-key :nth-child(' + i + ') .title_game a').attr('href');
        key.key = $('#steam-key :nth-child('  + i  + ') .span-keys').children('div.option').attr('id');
        key.gifted = false;
        key.gifted_to = "";
        keys.push(key);
        game.keys = keys;
        games.push(game);
      }
    }

    games = removeDupes(games);
    bundle.games = games;
  }    */

  /* DRM FREE GAMES */

  /*if($('#drm-free-games :nth-child(2) #stringa-music-key .button').attr('href') !== undefined){
    for(var i = 2; i < 100; i++ ){
      if($('#drm-free-games :nth-child(' + i +') #stringa-music-key .button').attr('href') === undefined){
        i = 1000;
      } else {
        var game = {};
        game.title = $('#drm-free-games :nth-child(' + i + ') #stringa-music-key .title_game')
                         .text().replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');

        game.title_slug = convertToSlug(game.title);
        game.platform = $('#drm-free-games :nth-child(' + i + ') #stringa-music-key .title_dev').text();
        game.dl_link = $('#drm-free-games :nth-child(' + i + ') #stringa-music-key .button').attr('href');
      }
      drm_free.push(game);
    }

    drm_free = removeDupes(drm_free);
    bundle.drm_free = drm_free;
  }    */

  /* MUSIC */

 /* if($('#steam-key :nth-child(2) #stringa-music-key .option:nth-child(2) .button').attr('href') !== undefined){
    for(var i = 2; i < 100; i++  )
    {
      if($('#steam-key :nth-child(' + i + ') #stringa-music-key .option:nth-child(2) .button').attr('href') === undefined){                     i = 1000;
      } else {
        var track = {};
        track.song_title = $('#steam-key :nth-child(' + i + ') #stringa-music-key .title_music')
                             .text()
                             .replace(/\t/g, '')
                             .replace(/\n/g,'')
                             .replace(/  /g,'');

        track.artist = $('#steam-key :nth-child(' + i + ') #stringa-music-key .title_dev')
                        .text()
                        .replace(/\t/g, '')
                        .replace(/\n/g,'')
                        .replace(/  /g,'');

        track.mp3 = $('#steam-key :nth-child(' + i + ') #stringa-music-key .option:nth-child(2) .button').attr('href');
        track.flac = $('#steam-key :nth-child(' + i + ') #stringa-music-key .option:nth-child(1) .button').attr('href');
      }
      music_tracks.push(track);
    }

    music_tracks = removeDupes(music_tracks);
    bundle.music_tracks = music_tracks;
  }    */

  /* ANDROID GAMES */
/*
  if($('#android :nth-child(' + 2 + ') .button').attr('href') !== undefined){
    for(var i = 2; i < 100; i  ){
      if($('#android :nth-child(' + i + ') .button').attr('href') === undefined){
        i = 1000;
      } else {
        var game = {};
        game.title = $('#android :nth-child(' + i + ') .game_info_title .title_game')
                        .text()
                        .replace(/\t/g, '')
                        .replace(/\n/g,'')
                        .replace(/  /g,'');

        game.title_slug = convertToSlug(game.title);
        game.dllink = $('#android :nth-child(' + i + ') .button').attr('href');
      }
      android_games.push(game);
    }

    android_games = removeDupes(android_games);
    bundle.android_games = android_games;
  }
}*/
//gamesList.val( JSON.stringify(bundle, null, 4));
//localStorage.setItem("Bundle", JSON.stringify(bundle));
