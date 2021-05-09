import { Produtos } from '@prisma/client';
import {iAlertsprops, ZeosConfig} from '../config/index'

export const GetAlertaPrice = (oldData: Produtos | undefined, newData : Produtos) => {
    let result : iAlertsprops;
    const existeReg = !oldData || oldData.id > 0;
    const aumentou = oldData && Number(newData.preco_desc) > Number(oldData.preco_desc);
    const baixou = oldData && Number(newData.preco_desc) < Number(oldData.preco_desc);
    const mudouDisp = oldData && newData.disponivel !== oldData.disponivel;
 
   // Não existe o produto
    if (!existeReg){
        result = ZeosConfig.alerts.newProduct; 

    // Se tornou indisponivel    
    } else if (mudouDisp && !newData.disponivel){   
        result = ZeosConfig.alerts.withoutStock;

    // Tornou disponivel    
    } else if (mudouDisp && newData.disponivel){
         // e baixou o preco
        if (baixou){
           result = ZeosConfig.alerts.priceDecreased;
         // e aumentou o preco  
        } else if (aumentou){
          result = ZeosConfig.alerts.priceIncreased;
          // preço nao mudou so ficou disponivel
        } else {
           result = ZeosConfig.alerts.withStock;
        }           

     // continua disponivel porem aumentou o preco     
    } else if(newData.disponivel && aumentou){
        result = ZeosConfig.alerts.priceIncreased;

    // continua disponivel porem baixou o preco   
    } else if(newData.disponivel && baixou){
        result = ZeosConfig.alerts.priceDecreased;
    } else {
        // sem alteracao nada a fazer
        result = ZeosConfig.alerts.noChange
    }

    return result
}