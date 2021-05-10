require('dotenv').config()
import {ZeosConfig, iAlertsprops, msgtypeprops, GetAlerta} from '../config'
const tl = require('node-telegram-bot-api');
import { Produtos, Telegram } from '@prisma/client'
import {Format} from './formatter'
//const Discord = require('discord.js');
//const webhookClient = new Discord.WebhookClient(process.env.DISCORD_WEBHOOK_ID, process.env.DISCORD_WEBHOOK_TOKEN);
const { manageTelegram } = require('../databaseHandlers/telegram');
const bot = new tl(process.env.TELEGRAM_TOKEN, {polling:true})

export async function sendNotifications(data: Produtos, ntf: string, oldData:Produtos | undefined){
    if(ntf in ZeosConfig.alerts){
        let alerta = GetAlerta(ntf)

        if(ZeosConfig.alerts.sendDiscordHook){
            await sendDiscordMsg(data, alerta);
        }
        if(ZeosConfig.alerts.sendTelegramMsg){            
           await sendTelegramMsgs(data, alerta, oldData);
        }
    }
    return;
}

export async function sendDiscordMsg(data: Produtos, config:iAlertsprops){
    return
  /*  const embed = new Discord.MessageEmbed()
	.setAuthor(msg)
	.setColor(color)
    .setTitle('link')
    .setURL(data.url)
    .setDescription(data.title)
    if(data.price){
        embed.addFields(
            {name: 'Preço', value:data.price}
        )
    }

    await webhookClient.send({embeds: [embed]})
    return;*/
}
export async function sendTelegramMsgs(data: Produtos, config:iAlertsprops, oldData:Produtos | undefined){

    const tempLink = data.site==='kabum'  ? `https://www.kabum.com.br${data.url}` : data.url;

    const newMsg = {
       nome: data.titulo,
       preco: `R$ ${data.preco_desc.toString()}`,
       oldpreco: oldData ? `R$ ${oldData.preco_desc.toString()}` : '0',
       link: Format.url('Clique aqui e compre!', tempLink) ,
       percChange : '0'
    }

    let temppercChange = 0
    if (oldData){
        if (Number(oldData.preco_desc) > 0) {
            temppercChange = ((Number(data.preco_desc) * 100) / Number(oldData.preco_desc)) - 100;
        } 
        newMsg.percChange = temppercChange.toFixed(2);
     }
    
    
    const linhaPreco = temppercChange != 0  ?  `${Format.bold(newMsg.preco)}  (${Format.bold( newMsg.percChange + '%')})` : Format.bold(newMsg.preco);

    let msgFormatt =  `${config.icon} ${config.msg}  ${`- ${data.site}`} \n\n${linhaPreco}\n${newMsg.link}\n`
    if (data.site === 'terabyte'){
        msgFormatt = `${config.icon} ${config.msg}  ${`- ${data.site}`} \n\n${linhaPreco}\n${newMsg.link}\n\n${newMsg.nome}`
    }

    await sendTelegram(msgFormatt);
}

export async function sendTelegram(msg: string){
    let ids : Telegram[] = await manageTelegram({op:'all'})

    const opts = {
        parse_mode: 'Markdown'
      };


    await ids.forEach(
      async function(id){          
        await bot.sendMessage(Number(id.chatid), msg, opts);
      }
    )
}

export async function startTelegramBot(){
    console.log('BOT Start ')
    bot.on('text', async(msg: any) => {
        const chatId = String(msg.chat.id);
        switch(msg.text){
            case "/watch":{
                let checking = await manageTelegram({id:chatId, op:'check'})
                console.log('checking', checking)
                if(checking){
                    await bot.sendMessage(chatId, 'Já estou observando este canal!');
                }else{
                    await manageTelegram({id: chatId, op:'add'})
                    await bot.sendMessage(chatId, 'Este canal agora receberá notificações sobre atualizações de preço!');
                }
                break;
            }
            case"/unwatch":{
                let checking = await manageTelegram({id:chatId, op:'check'})
                if(!checking){
                    await bot.sendMessage(chatId, 'Ainda não estou observando este canal!');
                }else{
                    await manageTelegram({id: chatId, op:'del'})
                    await bot.sendMessage(chatId, 'Este canal agora não receberá notificações sobre atualizações de preço!');
                }
                break;
            }
            default:
                break;
        }
    });
}

