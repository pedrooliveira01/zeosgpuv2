import {urlprops} from '../utils/types';
import {default as ScrapperKabum} from './scrapperKabum';
import {default as ScrapperPichau} from './scrapperPichau';
import {default as ScrapperTerabyte} from './scrapperTerabyte';
import {getHTML} from './getUrl_got';
import { Produtos } from '@prisma/client'
import {default as SaveData} from './saveData';

export default async (data:urlprops) =>{
  let result : Produtos[] = [];

  if (data.type === 'kabum'){  
    result = await ScrapperKabum( await getHTML(data.url.link), data.url.nome )      
  }

  if (data.type === 'terabyte'){  
    result = await ScrapperTerabyte(data);
  }  

  if (data.type === 'pichau'){  
    result = await ScrapperPichau( await getHTML(data.url.link), data.url.nome );       
  }  
  
  if (result && result.length>0){
    await SaveData(result) 
  }
} 