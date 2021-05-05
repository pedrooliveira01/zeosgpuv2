export {default as kabumArr} from './kabum'

export interface iMsgtypeprops {
    withStock: string, 
    withoutStock: string,
    priceIncreased: string,
    priceDecreased:  string,
    newProduct: string,
    empty: string
}

export const msgtypeprops : iMsgtypeprops = {
    withStock: "withStock", 
    withoutStock: "withoutStock",
    priceIncreased: "priceIncreased",
    priceDecreased: "priceDecreased" ,
    newProduct:"newProduct",
    empty: ""
}

export interface iAlertsprops {
    ativo : boolean,
    msg: string,
    color: string,
    msgCode: string
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
            msgCode : msgtypeprops.withStock,
        },
        withoutStock: {
            ativo: true,
            msg : 'VOLTOU AO ESTOQUE!',
            color : '#00ff00',
            msgCode : msgtypeprops.withoutStock,
        },
        priceIncreased: {
            ativo: false,
            msg : 'PREÇO AUMENTOU!',
            color : '#ffff00',
            msgCode : msgtypeprops.priceIncreased,
        },
        priceDecreased: {
            ativo: true,
            msg : 'PREÇO DIMINUIU!',
            color : '#0000ff',
            msgCode : msgtypeprops.priceDecreased,
        },
        newProduct:{
            ativo: true,
            msg : 'NOVO PRODUTO!',
            color : '#ff00ff',
            msgCode : msgtypeprops.newProduct,
        }
    },
    sites:{
      kabum: true  
    }      
}