'use strict';
import {urlprops} from './index';
import {kabumItemprops, saveDataPromise} from './scrapp';
const cheerio = require('cheerio');

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())

export async function ScrapperTerabyte(url:urlprops){   
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
    await page.goto(url.url);  
    const body = `<div id="produto"> ${await page.$eval('#prodarea', (e:any) => e.innerHTML)} </div>`;
    const $ = cheerio.load(body);
    const list = await  $('div#produto').find('div.commerce_columns_item_inner');
    
    console.log('Total de produtos: ', list.length)

    await list.each(async (i: number, e:any) => {
      const dados = {
        titulo : await $(e).find('div.commerce_columns_item_caption').find('a').attr('title'),
        url : await $(e).find('div.commerce_columns_item_caption').find('a').attr('href'),
        valor: await $(e).find('div.commerce_columns_item_info > div > div.prod-new-price > span').text(),
        disponivel: await $(e).find('div.commerce_columns_item_info > div > div.tbt_esgotado').text() 
      }

      const valor = dados.valor === '' ? 0 : Number(dados.valor.replace('R$ ', '').replace('.', '').replace(',', '.'));

      const dataSave : kabumItemprops= {
        disponibilidade : dados.disponivel ==='',
        link_descricao: dados.url,
        nome: dados.titulo,
        preco: valor,
        preco_desconto: valor
      }      


      await saveDataPromise(dataSave,'terabyte'); 
    
    });

     
  } catch (error) {
    console.log(error);
    browser.close();
  } finally {
    browser.close();  
  }

}

