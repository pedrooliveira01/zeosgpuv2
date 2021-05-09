
import {genUrls, urlprops} from './utils/index'
import {Scrapper} from './utils/scrapp'
import {startTelegramBot} from './utils/notifications'
import {ZeosConfig} from './config';

function sleep(millis:number) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

async function ScrapperURL(url:urlprops) {  
  console.log('LINK: ', url.url)
  await Scrapper(url);
}


async function RunApp(){
  const urls:urlprops[] = genUrls();
  var promise = Promise.resolve();

  if (urls){   
    urls.forEach(function (url) {
      promise = promise.then(async function () {
        await ScrapperURL(url);
        return new Promise(function (resolve) {
          setTimeout(resolve, 3105);
        });
      });
    });

    promise.then(function () {
      RunApp();
    });           
 
  }  
}


async function main(){
  try{  
    console.log('Sistema Iniciado')  
    if(ZeosConfig.alerts.sendTelegramMsg) {
      startTelegramBot();       
    }
    RunApp();      
   
  }catch(e){
    console.log(e.message);
  }
}

main();