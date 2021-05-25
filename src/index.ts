
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
  try {
      if (urls){   
        for (const [idx, url] of urls.entries()) {
            await RunApp(url, 1000)  
         }  
        RunAppKabum();        
      }  
      
  } catch (error) {
    console.log('ERRO:',error.message)      
    RunAppKabum();        
  }
}

async function RunAppPichau(){
  const urls:urlprops[] = genUrlsPichau();
  try {
      if (urls){   
        for (const [idx, url] of urls.entries()) {
            await RunApp(url, 1000)  
         }  
         RunAppPichau();        
      }  
      
  } catch (error) {
    console.log('ERRO:',error.message)      
    RunAppPichau();        
  }

}

async function RunAppTerabyte(){ 
  const urls:urlprops[] = genUrlsTerabyte();

  if (urls){   
    try {
        for (const [idx, url] of urls.entries()) {
            await RunApp(url, 1000)  
         }  
         RunAppTerabyte();     
    } catch (error) {
        console.log('ERRO:',error.message)
        RunAppTerabyte();   
    }  
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