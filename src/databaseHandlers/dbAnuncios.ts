import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({})

export async function getAnuncios(){
	try{
		const anuncios = await prisma.anuncios.findMany({
            where:{
                ativo: 1
            }
        })
		await prisma.$disconnect;
		return anuncios
	}catch(e){
		console.log(e.message);
	}
}

export async function updateAnuncioNotify(id: number){
	try{
		const anuncios = await prisma.anuncios.update({
            data: {
                updatedAt: new Date(),
                message: `🦾 ZeosGPU é gratuito\n\n🟢 Ajude nosso projeto. (PIX)\n🔗 pedro.pix.nu@hotmail.com\n\n🟢 Compre com Méliuz (Cashback)\n🔗 https://bityli.com/Tqm7T\n\nAgradeço a todos e ótimas compras!\n`
            },
            where:{
                id: id 
            }
        })
		await prisma.$disconnect;
		return anuncios
	}catch(e){
		console.log(e.message);
	}
}