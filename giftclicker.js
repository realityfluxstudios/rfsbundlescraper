    var gifts = $('#icon-gift img');
    if(gifts.length > 0){
      var interval = setInterval(function(){
        gifts = $('#icon-gift img');
        gifts[0].click();
        gifts[0].remove();
        if(gifts.length == 1)
          clearInterval(interval);
      }, 1500);
    } else {
      console.log('No gift images to click!');
    }
