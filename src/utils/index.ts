import {ZeosConfig,kabumArr,terabyteArr,pichauArr} from '../config'
const s = require('array-shuffle');

export interface urlprops {
  url: string,
  type: string
}

export function genUrls(){
    let urls = [];
    if (ZeosConfig.sites.kabum){    
      for(var str of kabumArr){        
        urls.push({url: str, type: 'kabum'})
      }
    }
    if (ZeosConfig.sites.terabyte){
      for(var str  of terabyteArr){
        urls.push({url: str, type: 'terabyte'})
      }
    }
 
    if (ZeosConfig.sites.pichau){
      for(var str of pichauArr){
        urls.push({url: str, type: 'pichau'})
      }
    }
    return s(urls);
}




