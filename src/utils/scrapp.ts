const got = require('got');
import {urlprops} from './index';
import { Produtos } from '@prisma/client'
import {dbStuff} from '../databaseHandlers/dbActions';
import { Decimal } from '@prisma/client/runtime';
const colors = require('colors');

interface itemprops {
    preco: number,
    preco_desconto: number,
    nome: string,
    link_descricao: string,
    disponibilidade: boolean  
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
            const produto : Produtos = {
                id: 0,
                titulo: item.nome,
                preco: new Decimal(item.preco),
                preco_desc: new Decimal(item.preco_desconto),
                disponivel : item.disponibilidade,
                site: 'kabum',
                url: item.link_descricao,
                createdAt: new Date(),
                updatedAt: null              
            }   
            const ntf = await dbStuff(produto);
            console.log('RESULTADO: ', ntf)
            switch(ntf){
              case "withoutStock":
                  console.log(` item: ${colors.red(item.nome)} preço:${colors.red( 'R$ 0,00')} disponivel: ${colors.red(item.disponibilidade)} - SEM ESTOQUE`);   
                  break
              case "withStock":
                  console.log(` item: ${colors.yellow(item.nome)} preço:${colors.yellow( `R$ ${item.preco_desconto}`)} disponivel: ${colors.yellow(item.disponibilidade)} - EM ESTOQUE`);   
                  break
              case "priceIncreased":
                  console.log(` item: ${colors.orange(item.nome)} preço:${colors.orange( `R$ ${item.preco_desconto}`)} disponivel: ${colors.orange(item.disponibilidade)} - AUMENTOU`);   
                  break
              case "priceDecreased":
                  console.log(` item: ${colors.green(item.nome)} preço:${colors.green( `R$ ${item.preco_desconto}`)} disponivel: ${colors.green(item.disponibilidade)} - ABAIXOU`);   
                  break
              case "newProduct":
                  console.log(` item: ${colors.blue(item.nome)} preço:${colors.blue( `R$ ${item.preco_desconto}`)} disponivel: ${colors.blue(item.disponibilidade)} - NOVO`);   
                  break                
            }
            
        });
      } 
    }    
  }



} 