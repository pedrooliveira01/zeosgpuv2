import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const channelTelegram = await prisma.telegram.upsert({      
      where: { id: 1 },
      update: {
        chatid : '-1001455108862',
      },
      create: {
        id: 1,
        chatid : '-1001455108862',
      },
  })

  const Anuncios = await prisma.anuncios.upsert({      
    where: { id: 1 },
    update: {
      sleep: 45000,
      ativo: 1,
      message: `🦾 ZeosGPU é gratuito\n\n🟢 Ajude nosso projeto. (PIX)\n🔗 pedro.pix.nu@hotmail.com\n\n🟢 Compre com Méliuz (Cashback)\n🔗 https://bityli.com/Tqm7T\n\nAgradeço a todos e ótimas compras!\n`,
      updatedAt: null
    },
    create: {
      sleep: 45000,
      ativo: 1,
      message: `🦾 ZeosGPU é gratuito\n\n🟢 Ajude nosso projeto. (PIX)\n🔗 pedro.pix.nu@hotmail.com\n\n🟢 Compre com Méliuz (Cashback)\n🔗 https://bityli.com/Tqm7T\n\nAgradeço a todos e ótimas compras!\n`,
      updatedAt: null,
      id: 1
    },
})    
  
 
  console.log(  'Registrado: ' , {channelTelegram})
  console.log(  'Anuncio: ' , {Anuncios})
 
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })