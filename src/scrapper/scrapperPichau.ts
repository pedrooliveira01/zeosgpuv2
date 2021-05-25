import { Produtos } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime';
import {iPichauItemprops} from '../utils/types';

export default async (body : string | undefined, descricao: string) => {
    const result : Produtos [] = []; 
    if (body){
        const listagem = body.substring(body.indexOf('<script type="application/ld+json">[{"@context":')+35, body.indexOf("}]</script>")+2);   
        const Parser =  JSON.parse(listagem)
        const dados : iPichauItemprops[] = Parser && Parser[0].mainEntity?.itemListElement ? Parser[0].mainEntity.itemListElement : [] 

        /*const totalFormat = `${dados.length}`.padStart(3,' ')
        const siteFormat = `[${'Pichau'.padStart(8,' ')}]`
        console.log(`${siteFormat} Total: ${totalFormat} | Busca: ${descricao}`); */ 
    
        for (const [idx, item] of dados.entries()) {               
            result.push({
                id: 0,
                titulo: item.name,
                preco: new Decimal(item.offers.price),
                preco_desc: new Decimal(item.offers.price),
                disponivel : item.offers.availability != 'http://schema.org/OutOfStock',
                site: 'pichau',
                url: item.offers.url,
                createdAt: new Date(),
                updatedAt: null ,
                notificadoAt: null             
            }  )      
        };
    }
    return result
}