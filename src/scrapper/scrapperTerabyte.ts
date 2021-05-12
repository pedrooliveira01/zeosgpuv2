'use strict';
import {urlprops} from '../utils/types';
import { Produtos } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime';
const cheerio = require('cheerio');

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())

process.setMaxListeners(Infinity);

export default async (url : urlprops ) => {    
  const result : Produtos [] = []; 
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    userDataDir: './tmp',
    handleSIGINT : false,
    args         : [
      '--disable-gpu',
      '--no-sandbox',
    ],
  });
  try {    
    const page = await browser.newPage();
    await page.goto(url.url.link);  
    const body = `<div id="produto"> ${await page.$eval('#prodarea', (e:any) => e.innerHTML)} </div>`;
    await browser.close();  
    const $ = cheerio.load(body);
    const list = await  $('div#produto').find('div.commerce_columns_item_inner');

    const totalFormat = `${list.length}`.padStart(3,' ')
    const siteFormat = `[${'Terabyte'.padStart(8,' ')}]`
    console.log(`${siteFormat} Total: ${totalFormat} | Busca: ${url.url.nome}`);  
    
    await list.each(async (i: number, item:any) => {
      const dados = {
        titulo : await $(item).find('div.commerce_columns_item_caption').find('a').attr('title'),
        url : await $(item).find('div.commerce_columns_item_caption').find('a').attr('href'),
        valor: await $(item).find('div.commerce_columns_item_info > div > div.prod-new-price > span').text(),
        disponivel: await $(item).find('div.commerce_columns_item_info > div > div.tbt_esgotado').text() 
      }

      const valor = dados.valor === '' ? 0 : Number(dados.valor.replace('R$ ', '').replace('.', '').replace(',', '.'));

      result.push({
        id: 0,
        titulo: dados.titulo,
        preco: new Decimal(valor),
        preco_desc: new Decimal(valor),
        disponivel : dados.disponivel ==='',
        site: 'terabyte',
        url: dados.url,
        createdAt: new Date(),
        updatedAt: null,
        notificadoAt: null              
      }  )      
    
    });

     
  } catch (error) {
    console.log(error);
    return result
  } finally {
    return result
  }

}

