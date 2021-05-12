import { Produtos } from '@prisma/client';
import { ZeosConfig} from '../config/index';
import {iAlertsprops} from '../utils/types';

export const GetAlertaPrice = (oldData: Produtos | undefined, newData : Produtos) => {
    let result : iAlertsprops;
    const existeReg = oldData && oldData.id > 0;
    const aumentou = oldData && Number(newData.preco_desc) > Number(oldData.preco_desc);
    const baixou = oldData && Number(newData.preco_desc) < Number(oldData.preco_desc);
    const ficouDisponivel = oldData && newData.disponivel && !oldData.disponivel;
    const ficouIndisponivel = oldData && !newData.disponivel && oldData.disponivel;

   // Não existe o produto
    if (!existeReg){
        result = ZeosConfig.alerts.newProduct; 

    // Se tornou indisponivel    
    } else if (ficouIndisponivel){   
        result = ZeosConfig.alerts.withoutStock;

    // Tornou disponivel    
    } else if (ficouDisponivel){
         result = ZeosConfig.alerts.withStock;       

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