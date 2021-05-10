import {kabumArr,terabyteArr,pichauArr} from '../config'

export interface urlprops {
  url: string,
  type: string
}

export function genUrlsKabum(){  
  return genUrls(kabumArr,'kabum')
}

export function genUrlsTerabyte(){
  return genUrls(terabyteArr,'terabyte')
}

export function genUrlsPichau(){
  return genUrls(pichauArr,'pichau')  
}

function genUrls(Arr:string[], type:string){
  let urls = []; 
  for(var str of Arr){        
    urls.push({url: str, type: type})
  }
  return urls;
}




