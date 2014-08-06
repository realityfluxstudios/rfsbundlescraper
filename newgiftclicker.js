var titles = $('.title_game a');
var gifts  = $('#icon-gift img');

for(var i = 0; i < titles.length; i++)
{
  var game = {};
  var key = {};
  key.gift_url = window.location.href;
  drm = titles[i].href;
  console.log(titles[i].href);
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

  game.title = titles[i].text;
  game.title_slug = this.convertToSlug(game.title);
  game.store_url = titles[i].href;

  var giftlink;

  if($('.keys').length === 0)
  {
    console.log('I am clicking all gift images...')
    if(gifts.length > 0){
      var interval = setInterval(function(){
        gifts = $('#icon-gift img');
        gifts[0].click();
        gifts[0].remove();
        if(gifts.length == 1){
          clearInterval(interval);
          console.log('I am done clicking all gift images!');
        }
      }, 1500);
    } else {
      console.log('No gift images to click!');
    }

    var gift_links = $('.keyfield a');
    gift_links[i]

  }
  console.log(game);