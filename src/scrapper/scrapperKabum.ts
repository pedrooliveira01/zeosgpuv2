import { Produtos } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime';
import {iScrapperprops} from '../utils/types';


export default async (body : string | undefined, descricao: string) => {
    const result : Produtos [] = []; 
    if (body){
        const listagem = body.substring(body.indexOf("const listagemDados =")+21, body.indexOf("const listagemErro "));       
        const dados : iScrapperprops[] =  JSON.parse(listagem)   

       /* const totalFormat = `${dados.length}`.padStart(3,' ')
        const siteFormat = `[${'Kabum'.padStart(8,' ')}]`
        console.log(`${siteFormat} Total: ${totalFormat} | Busca: ${descricao}`);*/
        
        for (const [idx, item] of dados.entries()) {  
            result.push({
                id: 0,
                titulo: item.nome,
                preco: new Decimal(item.preco),
                preco_desc: new Decimal(item.preco_desconto),
                disponivel : item.disponibilidade,
                site: 'kabum',
                url: item.link_descricao,
                createdAt: new Date(),
                updatedAt: null,
                notificadoAt: null              
              }  )          
        }
    }
    return result
}