import { Produtos } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime';
import {iScrapperprops} from '../utils/types';


export default async (body : string | undefined, descricao: string) => {
    const result : Produtos [] = []; 
    if (body){
       // const listagem = body.substring(body.indexOf("const listagemDados =")+21, body.indexOf("const listagemErro "));       
      //  const dados : iScrapperprops[] =  JSON.parse(listagem)   
      const dados = JSON.parse(body);

       /* const totalFormat = `${dados.length}`.padStart(3,' ')
        const siteFormat = `[${'Kabum'.padStart(8,' ')}]`
        console.log(`${siteFormat} Total: ${totalFormat} | Busca: ${descricao}`);*/
        
        for (const [idx, item] of dados.data.entries()) {  
           result.push({
                id: 0,
                titulo: item.attributes.title,
                preco: new Decimal(item.attributes.price),
                preco_desc: new Decimal(item.attributes.price_with_discount),
                disponivel : item.attributes.available,
                site: 'kabum',
                url: `/produto/${item.id}`,
                createdAt: new Date(),
                updatedAt: null,
                notificadoAt: null              
              }  )  
        }
    }
    return result
}