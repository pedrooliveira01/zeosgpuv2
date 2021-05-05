import {sendNotifications} from '../utils/notifications';
import { PrismaClient, Produtos } from '@prisma/client';
import {GetAlertaPrice, AlertaEmpty, iAlertsprops, msgtypeprops} from '../config'
const chalk = require('chalk');

const prisma = new PrismaClient({
	//log: ['query'],
  })

export async function dbStuff(data : Produtos){
	try{
		let Produtos = await hasProdutos(data);		
		if(Produtos){	
			const result = GetAlertaPrice(Produtos.id>0, Number(Produtos.preco_desc), Number(data.preco_desc));
			if (result.ativo){		      
			  await updateProdutos(Produtos, data, result);
			}
			logConsole(data,result)
			return result
		}else{
			const result = GetAlertaPrice(false,null, null);
			if (result.ativo){
			  await createProdutos(data, result);			  
			}
			logConsole(data,result)
			return AlertaEmpty
		}
	}catch(e){
		console.log(e.message)
		return AlertaEmpty
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

	await prisma.$connect;

	const result = await prisma.produtos.update({
			where:{
				id: old.id
			},
            data: updateData		
		})

    await prisma.$disconnect;
	await sendNotifications(data, alerta.type);
	return result;
	
}

async function hasProdutos(data : Produtos){
	try{
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
	
		if (data.preco_desc){	      
		  await sendNotifications(data, alerta.type);
		}
	}catch(e){
		console.log(e.message);
	}
}


const logConsole = ( produto : Produtos, alerta:iAlertsprops)=>{
	const disponivelChalk = produto.disponivel ? 'green' : 'gray'
	const disponivelData = produto.disponivel ? 'Sim' : 'Nao'
	const precoFormat = `R$ ${produto.preco_desc.toFixed(2)}`.padStart(11,' ')

	switch(alerta.type){
	  case msgtypeprops.withoutStock:
		  console.log(chalk`{magenta [${produto.site}]} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'SEM ESTOQUE'.padStart(13, ' ')}] {red - ${produto.titulo}}`);   		  
		  break
	  case msgtypeprops.withStock:
		  console.log(chalk`{magenta [${produto.site}]} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'EM ESTOQUE'.padStart(13, ' ')}] {magenta - ${produto.titulo}}`);  		            
		  break
	  case msgtypeprops.priceIncreased:
		  console.log(chalk`{magenta [${produto.site}]} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'AUMENTOU'.padStart(13, ' ')}] {yellow - ${produto.titulo}}`);  		  
		  break
	  case msgtypeprops.priceDecreased:
		  console.log(chalk`{magenta [${produto.site}]} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'ABAIXOU'.padStart(13, ' ')}] {green - ${produto.titulo}}`);  		  
		  break
	  case msgtypeprops.newProduct:
		  console.log(chalk`{magenta [${produto.site}]} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'NOVO'.padStart(13, ' ')}] {blue - ${produto.titulo}}`);  
		  break       
	  case msgtypeprops.noChange:
		  console.log(chalk`{magenta [${produto.site}]} {${disponivelChalk} [disp.: ${disponivelData}]} {cyan [${ precoFormat}]} [${'SEM ALTERACAO'.padStart(13, ' ')}] {gray - ${produto.titulo}}`); 
		  break     
	  default: 
	     break;	  		           
	}	
}

