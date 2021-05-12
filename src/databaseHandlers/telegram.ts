import { PrismaClient } from '@prisma/client'
import {iTelegramprops} from '../utils/types'

const prisma = new PrismaClient()

async function manageTelegram({id, op} : iTelegramprops){
	if(op == 'add'){
        await prisma.telegram.create({
            data:{
                chatid: id
            }
        })
	}else if(op == 'del'){

        const deleteItem = await prisma.telegram.findFirst({
            where:{
                chatid: id
            }
        })	

        if (deleteItem)	{
            await prisma.telegram.delete({
                where:{
                id : deleteItem?.id 
                }
            })
        }
		
	}else if(op == 'all'){
		return await prisma.telegram.findMany();
	}else if(op == 'check'){
		let isWatching = await prisma.telegram.findMany({
			where:{
				chatid: id
			}
		})
		if(isWatching[0]){
			return true
		}
		return false
	}
}

exports.manageTelegram = manageTelegram;