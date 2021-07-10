export {default as kabumArr} from './kabum'
export {default as terabyteArr} from './terabyte'
export {default as pichauArr} from './pichau'
import {cMsgtypeprops, cAlertaEmpty} from '../utils/types'


export const ZeosConfig = 
{
    emitSockets:false,
    anuncios: true,
    alerts:{
        sendDiscordHook:false,
        sendTelegramMsg:true,
        withStock: {
            ativo: true,
            msg : 'Voltou ao estoque!',
            color : '#ff0000',
            type : cMsgtypeprops.withStock,
            icon : '📦'
        },
        withoutStock: {
            ativo: false,            
            msg : 'Acabou o estoque!',
            color : '#00ff00',
            type : cMsgtypeprops.withoutStock,
            icon : '😤'
        },
        priceIncreased: {
            ativo: true,
            msg : 'Preço subiu!',
            color : '#ffff00',
            type : cMsgtypeprops.priceIncreased,
            icon: '😕'
        },
        priceDecreased: {
            ativo: true,
            msg : 'Preço diminuiu!',
            color : '#0000ff',
            type : cMsgtypeprops.priceDecreased,
            icon : '🔥'
        },
        newProduct:{
            ativo: true,
            msg : 'Novo produto!',
            color : '#ff00ff',
            type : cMsgtypeprops.newProduct,
            icon : '🆕'
        },
        noChange:{
            ativo: false,
            msg : 'Sem alteração!',
            color : '#f0f0f0',
            type : cMsgtypeprops.noChange,
            icon : ''
        }
    },
    sites:{
      kabum: true,
      terabyte: true,
      pichau: true
    }      
}

export const GetAlerta = (_type:string) => {
    switch(_type){
        case "withoutStock":
            return ZeosConfig.alerts.withoutStock;
        case "withStock":
            return ZeosConfig.alerts.withStock;
        case "priceIncreased":
            return ZeosConfig.alerts.priceIncreased;
        case "priceDecreased":
            return ZeosConfig.alerts.priceDecreased;
        case "newProduct":
            return ZeosConfig.alerts.newProduct;  
	    default: 
	       break;	                        
    }
    return cAlertaEmpty
}

