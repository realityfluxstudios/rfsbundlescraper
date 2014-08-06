var JSONstring = prompt("Paste JSON");
var bundle = JSON.parse(JSONstring);

bundle = JSON.parse(localStorage.getItem("Bundle"));

$('#indie_gala_2 h2')
.append('<div id="games-list" style="text-align: center;">
        <textarea onClick="this.select();" id="games-list-text" rows="25" cols="950" style="width:900px"></textarea>
        </div>');

gamesList = $('#games-list-text');

if($('#steam-key :nth-child(2) .title_game a').attr('href') !== undefined){
  /* because we dont know how many items there are I make sure there */
  for(var i = 2; i < 100; i  )
  {
    var keys = [];
    if($('#steam-key :nth-child('+i+') .title_game a').attr('href') === undefined)
    {
      i = 1000;
    } else {
      var key = {};
      var url = window.location.href;
      key.gift_url = url;
      key.key = $('#steam-key :nth-child('+i+') .span-keys').children('div.option').attr('id');
      key.gifted = false;key.gifted_to = "";
      title = $('#steam-key :nth-child('+i+') .title_game a').text();
      for(var j = 0; j < bundle.games.length; j++  )
      {
        if(bundle.games[j].title == title){
          bundle.games[j].keys.push(key);
        }
      }
    }
  }
}

gamesList.val( JSON.stringify(bundle, null, 4));

localStorage.setItem("Bundle", JSON.stringify(bundle));