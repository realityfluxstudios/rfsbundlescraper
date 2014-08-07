javascript:(function(){
    $('#indie_gala_2 h2').append('<div id="games-list" style="text-align: center;"><textarea onClick="this.select();" id="games-list-text" rows="25" cols="950" style="width:900px"></textarea></div>');
    gamesList = $('#games-list-text');
    gamesList.val( window.location.href );
    
    gamesList.val(gamesList.val() + "\nTitle\t Type\t Key\t Store URL");

    /* DRM GAMES */
    if($('#steam-key :nth-child(' + 2 + ') #stringa-game-key .title_dev a').attr('href') !== undefined)
    {
        for(var i = 2; i < 100; i++)
        {
            if($('#steam-key :nth-child(' + i + ') #stringa-game-key .title_dev a').attr('href') === undefined)
            {
                i = 1000;
            } else {
                drm = $('#steam-key :nth-child(' + i + ') #stringa-game-key .title_dev a').attr('href');
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
                Title = $('#steam-key :nth-child(' + i + ') #stringa-game-key .title_game a').text();
                StoreURL = $('#steam-key :nth-child(' + i + ') #stringa-game-key .title_dev a').attr('href');
                GameKey = $('#steam-key :nth-child(' + i + ') .span-keys').children('div.option').attr('id');
                gamesList.val(gamesList.val() + "\n" + Title + '\t ' + drm + '\t ' + GameKey + '\t ' + StoreURL);
            }
        }
    }
    /* DRM FREE GAMES */
    if($('#drm-free-games :nth-child(' + 2 + ') #stringa-music-key .button').attr('href') !== undefined)
    {
        gamesList.val(gamesList.val() + "\n" + "DRM Free Games");
        for(var i = 2; i < 100; i++)
        {
            if($('#drm-free-games :nth-child(' + i + ') #stringa-music-key .button').attr('href') === undefined)
            {
                i = 1000;
            }      else       {
                Title = $('#drm-free-games :nth-child(' + i + ') #stringa-music-key .title_game').text().replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
                Platform = $('#drm-free-games :nth-child(' + i + ') #stringa-music-key .title_dev').text();
                DLLink = $('#drm-free-games :nth-child(' + i + ') #stringa-music-key .button').attr('href');
                gamesList.val(gamesList.val() + "\n" + Title + ' ( ' + Platform + ' )\t Download\t ' + DLLink + '\t ');
            }
        }
    }
    /* MUSIC */
    if($('#steam-key :nth-child(2) #stringa-music-key .option:nth-child(2) .button').attr('href') !== undefined)  {
        gamesList.val(gamesList.val() + "\n" + "Music");
        for(var i = 2; i < 100; i++)
        {
            if($('#steam-key :nth-child(' + i + ') #stringa-music-key .option:nth-child(2) .button').attr('href') === undefined)
            {
                i = 1000;
            } else {
                Title = $('#steam-key :nth-child(' + i + ') #stringa-music-key .title_music').text().replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
                Title = Title + " - " + $('#steam-key :nth-child(' + i + ') #stringa-music-key .title_dev').text().replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');

                MP3DLLink = $('#steam-key :nth-child(' + i + ') #stringa-music-key .option:nth-child(2) .button').attr('href');
                FLACDLLink = $('#steam-key :nth-child(' + i + ') #stringa-music-key .option:nth-child(1) .button').attr('href');
                gamesList.val(gamesList.val() + "\n" + Title + ' (MP3)\t Download\t ' + MP3DLLink + '\t ');
                gamesList.val(gamesList.val() + "\n" + Title + ' (FLAC)\t Download\t ' + FLACDLLink + '\t ');
            }
        }
    }
    /* ANDROID GAMES */
    if($('#android :nth-child(' + 2 + ') .button').attr('href') !== undefined)
    {
        gamesList.val(gamesList.val() + "\n" + "Android Games");
        for(var i = 2; i < 100; i++)
        {
            if($('#android :nth-child(' + i + ') .button').attr('href') === undefined)
            {
                console.log("if");
                i = 1000;
            } else {
                Title = $('#android :nth-child(' + i + ') .title_game').text().replace(/\t/g, '').replace(/\n/g,'').replace(/  /g,'');
                DLLink = $('#android :nth-child(' + i + ') .button').attr('href');
                gamesList.val(gamesList.val() + "\n" + Title + '\t Download\t ' + DLLink + '\t ');
            }
        }
    }
})();
