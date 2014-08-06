var settings = {
  interval : 0,
  giftLinks : $('#icon-gift img')
}

var other = {
  clicker : function(){

    if(settings.giftLinks.length > 0){
      settings.interval = setInterval(function(){
        console.log('settings.interval: ' + settings.interval);
        console.log('settings.giftLinks.length: ' + settings.giftLinks.length);
        if(settings.giftLinks.length == 0){
          console.log('giftLinks.length == 0 => ' + settings.giftLinks.length);
          clearInterval(settings.interval);
          settings.interval = 0;
        } else {
          console.log('giftLinks.length != 0 => ' + settings.giftLinks.length);
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

  run: function(){
    do{
      if(settings.giftLinks.length >= 1 && settings.interval == 0){
        console.log('inside do->if: settings.giftLinks.length: ' + settings.giftLinks.length);
        console.log('inside do->if: settings.interval: ' + settings.interval);
        this.clicker();
        break;
      }
      console.log('inside do: settings.giftLinks.length: ' + settings.giftLinks.length);
      console.log('inside do: settings.interval: ' + settings.interval);
    }while(settings.giftLinks.length > 0 && settings.interval != 0);
    console.log('Outside do..while loop!');
    console.log('Successfully completed clicking on images!');
  }
}