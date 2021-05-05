const got = require('got');
import {urlprops} from './index';
import { Produtos } from '@prisma/client'
import {dbStuff} from '../databaseHandlers/dbActions';
import { Decimal } from '@prisma/client/runtime';

interface itemprops {
    preco: number,
    preco_desconto: number,
    nome: string,
    link_descricao: string,
    disponibilidade: boolean  
  }

async function saveDataPromise(data : itemprops) {
  const produto : Produtos = {
    id: 0,
    titulo: data.nome,
    preco: new Decimal(data.preco),
    preco_desc: new Decimal(data.preco_desconto),
    disponivel : data.disponibilidade,
    site: 'kabum',
    url: data.link_descricao,
    createdAt: new Date(),
    updatedAt: null              
  }   
  return new Promise(function (resolve) {
    dbStuff(produto);
  });
}

export async function Scrapper(url:urlprops){
  const response = await got(url.url);

  if (response){
    if (response.error) {
        console.log(response.error)
    } else {
      const html = response.body;   
      if (html && url.type === 'kabum'){  
        const listagem = html.substring(html.indexOf("const listagemDados =")+21, html.indexOf("const listagemErro "));       
        const dados : itemprops[] =  JSON.parse(listagem)
        await dados.forEach(async function(item:itemprops){
           var promise = Promise.resolve();
           promise.then(async function () {
             return saveDataPromise(item)
          });
     
        });
      } 
    }    
  }



} 