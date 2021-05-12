import {kabumArr,terabyteArr,pichauArr} from '../config'
import {siteArr, urlprops} from './types'


export function genUrlsKabum(){  
  return genUrls(kabumArr,'kabum')
}

export function genUrlsTerabyte(){
  return genUrls(terabyteArr,'terabyte')
}

export function genUrlsPichau(){
  return genUrls(pichauArr,'pichau')  
}

function genUrls(Arr:siteArr[], type:string){
  let urls : urlprops[] = []; 
  for(var data of Arr){        
    urls.push({url:data, type: type})
  }
  return urls;
}




