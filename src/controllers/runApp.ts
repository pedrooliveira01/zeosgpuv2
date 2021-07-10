import {urlprops} from '../utils/types'
import {default as Scrapper} from '../scrapper'

export async function RunSleep(timeout: number){
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });  
}

export async function RunApp(url:urlprops, timeout:number){
    await Scrapper(url);
    
    return await RunSleep(timeout);
  }