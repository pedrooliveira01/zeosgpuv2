import { PrismaClient, Produtos } from '@prisma/client';

const prisma = new PrismaClient({})

export async function getProdutoByUrl(url : string){
	try{
		const produto = await prisma.produtos.findFirst({
			where:{
				url: url
			}
		})
		await prisma.$disconnect;
		return produto
	}catch(e){
		console.log(e.message);
	}
}

export async function getProdutoByID(id : number){
	try{
		const produto = await prisma.produtos.findUnique({
			where:{
				id: id
			}
		})
		await prisma.$disconnect;
		return produto
	}catch(e){
		console.log(e.message);
	}
}


export async function updateProduto(data : any, id: number){
    try{
        const produto = await prisma.produtos.update({
                where:{
                    id: id
                },
                data: data		
            })

        await prisma.$disconnect;

        return produto;
    }catch(e){
        console.log(e.message);
    }	
}

export async function createProduto(data: Produtos){
	const {id, ...props} = data;
	try{
		const result = await prisma.produtos.create({
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
        return result;
	}catch(e){
		console.log(e.message);
	}
}