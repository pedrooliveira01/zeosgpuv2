import { Produtos } from '@prisma/client'
import {dbStuff} from '../databaseHandlers/dbActions';

async function saveDataPromise(data : Produtos) {  
 if (!data.titulo.includes('PC ') &&!data.titulo.includes('omputador')){
    await dbStuff(data)      
  }   
}

export default async (data : Produtos[]) => {   
  for (const [idx, produto] of data.entries()) {
    await saveDataPromise(produto);
  }
}