import { Produtos } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime';
import {iPichauItemprops} from '../utils/types';

export default async (body : string | undefined, descricao: string) => {
    const result : Produtos [] = []; 
    if (body){
        const listagem = body.substring(body.indexOf('<script type="application/ld+json">[{"@context":')+35, body.indexOf("}]</script>")+2);   
        const dados : iPichauItemprops[] = JSON.parse(listagem)

        const totalFormat = `${dados.length}`.padStart(3,' ')
        const siteFormat = `[${'Pichau'.padStart(8,' ')}]`
        console.log(`${siteFormat} Total: ${totalFormat} | Busca: ${descricao}`);  
    
        for (const [idx, item] of dados.entries()) {  
            result.push({
                id: 0,
                titulo: item.name,
                preco: new Decimal(item.offers[0].price),
                preco_desc: new Decimal(item.offers[0].price),
                disponivel : item.offers[0].availability != 'http://schema.org/OutOfStock',
                site: 'pichau',
                url: item.offers[0].url,
                createdAt: new Date(),
                updatedAt: null ,
                notificadoAt: null             
              }  )        
    
        };
    }
    return result
}