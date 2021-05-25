export interface siteArr {
    link: string,
    nome: string
  }
  
export interface urlprops {
    url: siteArr,
    type: string
  }

export interface iScrapperprops {
    site: string,
    preco: number,
    preco_desconto: number,
    nome: string,
    link_descricao: string,
    disponibilidade: boolean  
  }  

export interface iPichaOffersprops {
    price: number,
    url: string,
    availability: string
  }  
  
export interface iPichauItemprops {
    name: string,
    offers:iPichaOffersprops
}  

export interface iAlertsprops {
    ativo : boolean,
    msg: string,
    color: string,
    type: string,
    icon: string
}

export const cAlertaEmpty : iAlertsprops = {
    ativo : false,
    msg: '',
    color: '',
    type: 'newProduct',
    icon: ''
}

export const cMsgtypeprops = {
    withStock: "withStock", 
    withoutStock: "withoutStock",
    priceIncreased: "priceIncreased",
    priceDecreased: "priceDecreased" ,
    newProduct:"newProduct",
    noChange:"noChange",
    empty: ""
}

export interface iTelegramprops {
    id: string,
    op: string 
}