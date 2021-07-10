import {genUrlsPichau} from '../utils/index';
import {urlprops} from '../utils/types';
import {RunApp} from './runApp';

export default async function RunAppPichau(){
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