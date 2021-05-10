const got = require('got');
import {urlprops} from './index';
import { Produtos } from '@prisma/client'
import {dbStuff} from '../databaseHandlers/dbActions';
import { Decimal } from '@prisma/client/runtime';
import {ScrapperTerabyte} from './scrapperTerabyte';

export interface kabumItemprops {
    preco: number,
    preco_desconto: number,
    nome: string,
    link_descricao: string,
    disponibilidade: boolean  
  }

interface pichaOffersprops {
  price: number,
  url: string,
  availability: string
}  

interface pichauItemprops {
    name: string,
    offers:pichaOffersprops[]
  }  

export async function saveDataPromise(data : kabumItemprops, site: string) {
  const produto : Produtos = {
    id: 0,
    titulo: data.nome,
    preco: new Decimal(data.preco),
    preco_desc: new Decimal(data.preco_desconto),
    disponivel : data.disponibilidade,
    site: site,
    url: data.link_descricao,
    createdAt: new Date(),
    updatedAt: null              
  }     

  if (!produto.titulo.includes('PC ')){
    return new Promise(function (resolve) {
      return dbStuff(produto);
    });
  } else {
    return 
  }
}

async function getHTML(url:string){
  try {
    const response = await got(url);
    const data = await response.body;

    if (response){
      if (response.error) {
          console.log(response.error)
          return undefined
      } else {
        return data
      }
    }       
  } catch (error) {
    console.log(error.message)
  }
}

export async function Scrapper(url:urlprops){

  if (url.type === 'kabum'){  
    const html = await getHTML(url.url);   
    if (html){
      const listagem = html.substring(html.indexOf("const listagemDados =")+21, html.indexOf("const listagemErro "));       
      const dados : kabumItemprops[] =  JSON.parse(listagem)
      console.log(`Link: ${url.url} - Total de produtos: `, dados.length)
      await dados.forEach(async function(item:kabumItemprops){
        var promise = Promise.resolve();
        await promise.then(async function () {
          return saveDataPromise(item, url.type)
        });
      });
    }
  }

  if (url.type === 'terabyte'){  
    await ScrapperTerabyte(url);
  }  

  if (url.type === 'pichau'){  
    const html = await getHTML(url.url);   
    if (html){
      const listagem = html.substring(html.indexOf('<script type="application/ld+json">[{"@context":')+35, html.indexOf("}]</script>")+2);   
      const dados : pichauItemprops[] = JSON.parse(listagem)
      console.log(`Link: ${url.url} - Total de produtos: `, dados.length)
      await dados.forEach(async function(item:pichauItemprops){
        var promise = Promise.resolve();
        await promise.then(async function () {
          const itemData :kabumItemprops = {
             disponibilidade: item.offers[0].availability != 'http://schema.org/OutOfStock',
             link_descricao: item.offers[0].url,
             nome: item.name,
             preco: item.offers[0].price,
             preco_desconto: item.offers[0].price
          }

          return saveDataPromise(itemData, url.type)
        });
      });

    }
  }    
  
  



} 