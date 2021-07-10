import {startTelegramBot, sendTelegram} from './utils/notifications'
import {ZeosConfig} from './config';
import {kabumController, pichauController, terabyteController, anuncioController} from './controllers';

async function main(){
  try{  
    console.log('Sistema Iniciado');

    if(ZeosConfig.alerts.sendTelegramMsg) {
      startTelegramBot();       
      sendTelegram('*ZeosGPU inicializado, em busca de precos...*')
    }

    if (ZeosConfig.sites.kabum){
      kabumController();     
    }

    if (ZeosConfig.sites.pichau){
      pichauController();
    }

    if (ZeosConfig.sites.terabyte){
      terabyteController();
    }

    if (ZeosConfig.anuncios){
      anuncioController();
    }
   
  }catch(e){
    console.log(e.message);
  }
}

main();