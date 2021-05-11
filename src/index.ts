
import {genUrlsKabum,genUrlsPichau,genUrlsTerabyte, urlprops} from './utils/index'
import {Scrapper} from './utils/scrapp'
import {startTelegramBot} from './utils/notifications'
import {ZeosConfig} from './config';

async function RunApp(url:urlprops, timeout:number){
  await Scrapper(url);
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}


async function RunAppKabum(){
  const urls:urlprops[] = genUrlsKabum();
  var promise = Promise.resolve();

  if (urls){   
    urls.forEach(function (url) {
      promise = promise.then(async function () {
        await RunApp(url, 3000)        
      });
    });

    promise.then(function () {
      RunAppKabum();
    });          
  }  
}

async function RunAppPichau(){
  const urls:urlprops[] = genUrlsPichau();
  var promise = Promise.resolve();

  if (urls){   
    urls.forEach(function (url) {
      promise = promise.then(async function () {
        await RunApp(url, 2000)        
      });
    });

    promise.then(function () {
      RunAppPichau();
    });          
  }  

}

async function RunAppTerabyte(){ 
  const urls:urlprops[] = genUrlsTerabyte();
  var promise = Promise.resolve();

  if (urls){   
    urls.forEach(function (url) {
      promise = promise.then(async function () {
        await RunApp(url, 2000)        
      });
    });

    promise.then(function () {
      RunAppTerabyte();
    });          
  }  
}


async function main(){
  try{  
    console.log('Sistema Iniciado')  
    if(ZeosConfig.alerts.sendTelegramMsg) {
      startTelegramBot();       
    }

    if (ZeosConfig.sites.kabum){
      RunAppKabum();     
    }

    if (ZeosConfig.sites.pichau){
      RunAppPichau();
    }

    if (ZeosConfig.sites.terabyte){
      RunAppTerabyte();
    }
   
  }catch(e){
    console.log(e.message);
  }
}

main();