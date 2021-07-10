import {genUrlsTerabyte} from '../utils/index';
import {urlprops} from '../utils/types';
import {RunApp} from './runApp';

export default async function RunAppTerabyte(){ 
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