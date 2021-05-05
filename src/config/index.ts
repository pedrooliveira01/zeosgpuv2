export {default as kabumArr} from './kabum'
export {default as terabyteArr} from './terabyte'
export {default as pichauArr} from './pichau'

export const msgtypeprops = {
    withStock: "withStock", 
    withoutStock: "withoutStock",
    priceIncreased: "priceIncreased",
    priceDecreased: "priceDecreased" ,
    newProduct:"newProduct",
    noChange:"noChange",
    empty: ""
}

export interface iAlertsprops {
    ativo : boolean,
    msg: string,
    color: string,
    type: string
}

export const AlertaEmpty : iAlertsprops = {
    ativo : false,
    msg: '',
    color: '',
    type: 'newProduct'
}

export const ZeosConfig = 
{
    emitSockets:false,
    alerts:{
        sendDiscordHook:false,
        sendTelegramMsg:true,
        withStock: {
            ativo: false,
            msg : 'ACABOU O ESTOQUE!',
            color : '#ff0000',
            type : msgtypeprops.withStock,
        },
        withoutStock: {
            ativo: true,
            msg : 'VOLTOU AO ESTOQUE!',
            color : '#00ff00',
            type : msgtypeprops.withoutStock,
        },
        priceIncreased: {
            ativo: false,
            msg : 'PREÃ‡O AUMENTOU!',
            color : '#ffff00',
            type : msgtypeprops.priceIncreased,
        },
        priceDecreased: {
            ativo: true,
            msg : 'PREÃ‡O DIMINUIU!',
            color : '#0000ff',
            type : msgtypeprops.priceDecreased,
        },
        newProduct:{
            ativo: true,
            msg : 'NOVO PRODUTO!',
            color : '#ff00ff',
            type : msgtypeprops.newProduct,
        },
        noChange:{
            ativo: false,
            msg : 'SEM ATERAÇÔES!',
            color : '#f0f0f0',
            type : msgtypeprops.noChange,
        }
    },
    sites:{
      kabum: true,
      terabyte: false,
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
    return AlertaEmpty
}

export const GetAlertaPrice = (existeReg:boolean,_precoOLD:number | null, _precoNEW:number | null) => {
    let result : iAlertsprops;
    if (!existeReg){
        result = ZeosConfig.alerts.newProduct; 
    }else if (!_precoNEW && _precoOLD){   
        result = ZeosConfig.alerts.withoutStock;
    }else if (_precoNEW && !_precoOLD){
        result = ZeosConfig.alerts.withStock;
    }else if(_precoNEW && _precoOLD && _precoOLD < _precoNEW){
        result = ZeosConfig.alerts.priceIncreased;
    }else if(_precoNEW && _precoOLD &&_precoOLD > _precoNEW){
        result = ZeosConfig.alerts.priceDecreased;
    } else {
        result = ZeosConfig.alerts.noChange
    }
    return result
}