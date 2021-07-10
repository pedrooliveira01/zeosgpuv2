import {RunSleep} from './runApp';
import {getAnuncios, updateAnuncioNotify} from '../databaseHandlers/dbAnuncios';
import { Anuncios } from '@prisma/client';
import {getDifferenceInSeconds} from '../utils/index';
import {sendTelegram} from '../utils/notifications'

export default async function RunAppAnuncio(){
 
  const anuncios: Anuncios[] | undefined = await getAnuncios() ;
  const dateNow = new Date();

  try {
    if (anuncios && anuncios.length>0){   
      for (const anuncio of anuncios) {
        const DateDiff = anuncio.updatedAt  ?  getDifferenceInSeconds(anuncio.updatedAt, dateNow) : -99999;

        if (DateDiff > anuncio.sleep || DateDiff === -99999){
          updateAnuncioNotify(anuncio.id);                    
          sendTelegram(anuncio.message);
        }

        await RunSleep(5000);
      }  
      RunAppAnuncio();        
    } else {
      console.log('sem anuncios');
      await RunSleep(5000);
      RunAppAnuncio(); 
    } 
        
  } catch (error) {
    console.log('ERRO:',error.message)      
    RunAppAnuncio();        
  }
}