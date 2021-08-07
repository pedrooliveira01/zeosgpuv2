import {genUrlsKabum} from '../utils/index';
import {urlprops} from '../utils/types';
import {RunApp} from './runApp';

export default async function RunAppKabum(){
    const urls:urlprops[] = genUrlsKabum();
    //console.log('ENTROU')
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