import {sendNotifications} from '../utils/notifications';
import { PrismaClient, Produtos } from '@prisma/client';

const prisma = new PrismaClient()

export async function dbStuff(data : Produtos){
	try{
		let Produtos = await hasProdutos(data);
		let result = '';
		if(Produtos){
			
			if (!data.preco_desc && Produtos.preco_desc){
				await updateProdutos(Produtos, data, "withoutStock")
				result = 'withoutStock'
			}
			else if (data.preco_desc && !Produtos.preco_desc){
				await updateProdutos(Produtos, data, "withStock")
				result = 'withStock'
			}else if(data.preco_desc && Produtos.preco_desc < data.preco_desc){
				await updateProdutos(Produtos, data, "priceIncreased");
				result = 'priceIncreased'
			}else if(data.preco_desc && Produtos.preco_desc > data.preco_desc){
				await updateProdutos(Produtos, data, "priceDecreased");
				result = 'priceDecreased'
			}
			else{
				result = '';
			}
		}else{
			await createProdutos(data);
			result = 'newProduct'
		}
		console.log(result)
		return result;
	}catch(e){
		console.log(e.message)
	}
}

async function updateProdutos(old:Produtos, data : Produtos, ntf: string){
	console.log('atualizar')
	const {id,site, ...props} = data;
	try{
		await prisma.produtos.update({
            data : {
				updatedAt: new Date(),
				...props,
				ProdutosHist:{
					create:{						
						preco: data.preco,
						preco_desc: data.preco_desc											
					}
				} 
			},
			where:{
				id: old.id
			}
		})
		await sendNotifications(data, ntf);
	}catch(e){
		console.log(e.message);
	}
}

async function hasProdutos(data : Produtos){
	try{
		const prod = await prisma.produtos.findFirst({
			where:{
				url: data.url
			}
		})
		return prod
	}catch(e){
		console.log(e.message);
	}
}

async function createProdutos(data: Produtos){
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
		  await sendNotifications(data, 'newProduct');
		}
	}catch(e){
		console.log(e.message);
	}
}


