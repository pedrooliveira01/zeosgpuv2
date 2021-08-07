import { Produtos } from '@prisma/client';
import { iAlertsprops, cMsgtypeprops} from '../utils/types'
import {GetAlertaPrice} from './getAlertaPrice';
const chalk = require('chalk');
import {getProdutoByUrl, updateProduto, createProduto} from './dbProdutos';
import {sendNotifications} from '../utils/notifications';

export async function dbStuff(data : Produtos){
	try{
		const Produto = await getProdutoByUrl(data.url);
		if (Produto) {	
			const result = await GetAlertaPrice(Produto, data);			  
			await prepareUpdateProduto(Produto, data, result);	
			logConsole(data,result)
		}else{
			const result = await GetAlertaPrice(undefined,data);			
			await prepareCreateProduto(data, result);	
			logConsole(data,result)
		}
	}catch(e){
		console.log(e.message)
	}finally{
        return
    }
}

async function prepareUpdateProduto(old:Produtos, data : Produtos, alerta: iAlertsprops){
    const dataNow = new Date();

	const {id,createdAt,updatedAt,titulo,notificadoAt,site,url, ...rest} = data;
	let updateData = {				
		...rest,
		updatedAt: dataNow
	}

	if (Number(data.preco) != Number(old.preco) || Number(data.preco_desc) != Number(old.preco_desc)  ){
		const ProdutosHist = {
			ProdutosHist:{
				create:{						
					preco: data.preco,
					preco_desc: data.preco_desc											
				}
			}
		} 
		updateData = {...updateData, ...ProdutosHist}
	}	
 
	if ( alerta.type !== cMsgtypeprops.noChange) {
        let EnviaMsg : boolean = false;
        try{             
            if (data.disponivel) {
                const dtIni = old.notificadoAt ? old.notificadoAt : old.createdAt;
                const dtNow = dataNow;
                const diff =(dtNow.getTime() - dtIni.getTime()) / 1000 / 60;
                if (diff > 10){                    
                    EnviaMsg = alerta.ativo;
                }
            }               

            if (EnviaMsg) {
              const _notificadoAt = {
                notificadoAt: dataNow 
              }
              updateData = {...updateData, ..._notificadoAt }  
            }

			const result = await updateProduto(updateData, old.id);

            if (EnviaMsg) {
              await sendNotifications(data, alerta.type, old);
            }
            return result;
        }catch(e){
            console.log(e.message);
        }	
    }	

}

async function prepareCreateProduto(data : Produtos, alerta: iAlertsprops){
	const produto = await createProduto(data);
	if (produto && produto.disponivel) {	      
		await sendNotifications(data, alerta.type, undefined);
	}
}  

const logConsole = async ( produto : Produtos, alerta:iAlertsprops)=>{
	
	const disponivelChalk = produto.disponivel ? 'green' : 'gray'
	const disponivelData = produto.disponivel ? 'Sim' : 'Nao'
	const precoFormat = `R$ ${produto.preco_desc.toFixed(2)}`.padStart(11,' ')
	const siteFormat = `[${produto.site.padStart(8,' ')}]`

	if (produto.disponivel){
		switch(alerta.type){
		case cMsgtypeprops.withoutStock:
			await console.log(chalk`{magenta ${siteFormat}} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'SEM ESTOQUE'.padStart(13, ' ')}] {red - ${produto.titulo}}`);   		  
			break
		case cMsgtypeprops.withStock:
			await console.log(chalk`{magenta ${siteFormat}} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'EM ESTOQUE'.padStart(13, ' ')}] {magenta - ${produto.titulo}}`);  		            
			break
		case cMsgtypeprops.priceIncreased:
			await console.log(chalk`{magenta ${siteFormat}} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'AUMENTOU'.padStart(13, ' ')}] {yellow - ${produto.titulo}}`);  		  
			break
		case cMsgtypeprops.priceDecreased:
			await console.log(chalk`{magenta ${siteFormat}} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'ABAIXOU'.padStart(13, ' ')}] {green - ${produto.titulo}}`);  		  
			break
		case cMsgtypeprops.newProduct:
			await console.log(chalk`{magenta ${siteFormat}} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'NOVO'.padStart(13, ' ')}] {blue - ${produto.titulo}}`);  
			break       
		case cMsgtypeprops.noChange:
			await console.log(chalk`{magenta ${siteFormat}} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'SEM ALTERACAO'.padStart(13, ' ')}] {gray - ${produto.titulo}}`); 
			break     
		default: 
			break;	  		           
		}	
	}
	return
}

