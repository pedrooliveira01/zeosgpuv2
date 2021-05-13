
import {genUrlsKabum,genUrlsPichau,genUrlsTerabyte} from './utils/index'
import {urlprops} from './utils/types'
import {default as Scrapper} from './scrapper'
import {startTelegramBot, sendTelegram} from './utils/notifications'
import {ZeosConfig} from './config';

async function RunApp(url:urlprops, timeout:number){
  await Scrapper(url);
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}


async function RunAppKabum(){
  const urls:urlprops[] = genUrlsKabum();

  if (urls){   
    for (const [idx, url] of urls.entries()) {
        await RunApp(url, 1000)  
     }  
    RunAppKabum();        
  }  
}

async function RunAppPichau(){
  const urls:urlprops[] = genUrlsPichau();

  if (urls){   
    for (const [idx, url] of urls.entries()) {
        await RunApp(url, 1000)  
     }  
     RunAppPichau();        
  }  

}

async function RunAppTerabyte(){ 
  const urls:urlprops[] = genUrlsTerabyte();

  if (urls){   
    for (const [idx, url] of urls.entries()) {
        await RunApp(url, 1000)  
     }  
     RunAppTerabyte();        
  }  
}


async function main(){
  try{  
    console.log('Sistema Iniciado')  
    if(ZeosConfig.alerts.sendTelegramMsg) {
      startTelegramBot();       
      sendTelegram('*ZeosGPU inicializado, em busca de precos...*')
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