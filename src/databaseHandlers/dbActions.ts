import {sendNotifications} from '../utils/notifications';
import { PrismaClient, Produtos } from '@prisma/client';
import { cAlertaEmpty, iAlertsprops, cMsgtypeprops} from '../utils/types'
import {GetAlertaPrice} from './getAlertaPrice';
const chalk = require('chalk');

const prisma = new PrismaClient({
	//log: ['query'],
  })

export async function dbStuff(data : Produtos){
	try{
		let Produtos = await hasProdutos(data);
		if(Produtos){	
			const result = await GetAlertaPrice(Produtos, data);			  
			await updateProdutos(Produtos, data, result);	
			logConsole(data,result)
		}else{
			const result = await GetAlertaPrice(undefined,data);			
			await createProdutos(data, result);	
			logConsole(data,result)
		}
	}catch(e){
		console.log(e.message)
	}finally{
        return
    }
}

async function updateProdutos(old:Produtos, data : Produtos, alerta: iAlertsprops){


	const {id,createdAt,updatedAt,titulo,site,url, ...rest} = data;
	let updateData = {				
		...rest,
		updatedAt: new Date()
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
        try{             
            if (data.disponivel) {
                const dtIni = old.notificadoAt ? old.notificadoAt : old.createdAt;
                const dtNow = new Date();
                const diff =(dtNow.getTime() - dtIni.getTime()) / 1000 / 60;
                if (!old.notificadoAt || diff > 10){                    
                    data.notificadoAt = new Date();
                }
            }        

            await prisma.$connect;

            const result = await prisma.produtos.update({
                    where:{
                        id: old.id
                    },
                    data: updateData		
                })

            await prisma.$disconnect;
            if (data.notificadoAt && alerta.ativo) {
              await sendNotifications(data, alerta.type, old);
            }
            return result;
        }catch(e){
            console.log(e.message);
        }	
    }	

}

async function hasProdutos(data : Produtos){
	try{
        data.notificadoAt = new Date();
		await prisma.$connect;
		const prod = await prisma.produtos.findFirst({
			where:{
				url: data.url
			}
		})
		await prisma.$disconnect;
		return prod
	}catch(e){
		console.log(e.message);
	}
}

async function createProdutos(data: Produtos, alerta: iAlertsprops){
	const {id, ...props} = data;
	try{
		await prisma.$connect;
		await prisma.produtos.create({
            data:{
				...props
				,ProdutosHist:{
					create:{						
						preco: data.preco,
						preco_desc: data.preco_desc											
					}
				} 
			}	
        });
		await prisma.$disconnect;
		if (data.disponivel) {	      
		  await sendNotifications(data, alerta.type, undefined);
		}
	}catch(e){
		console.log(e.message);
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

