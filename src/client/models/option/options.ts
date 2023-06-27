import { GptService } from "../../../gpt/gpt.service";
import { IOption } from "./option.interface";

let isFirst = true
let isNextAudio = false
let lastUser: string
export const optionsRespond: IOption[] = [{
    message: "Conversar com o Chat GPT", action: async (client: any, message: any) => {
        const messageToSend = `Faça alguma pergunta digitando uma frase iniciada com "GPT me responda [...]"`
        client.sendText(message.chatId, messageToSend)
    }, show: true
},
{
    message: "Menu", action: async (client: any, message: any) => {
        const messageToSend = `Olá, tudo bem? Eu sou a Makima! 💜\n Inteligência artificial que te ajuda aqui no Zap! É um prazer acompanha-lo(a).\n\nPara te auxiliar da melhor forma, me diga de forma precisa qual das opções abaixo você deseja escolher.\n\nNão se esqueça de me marcar em todas as mensagens\n\n${optionsRespond.map((option) => option.show ? `• *${option.message}*\n` : null).join("\n")}\n\nPeça pelo menu, para visualizar o menu principal.`
        client.sendText(message.chatId, messageToSend)
    }, show: true
},
{
    message: "Opções", action: async (client: any, message: any) => {
        const messageToSend = `Olá, tudo bem? Eu sou a Makima! 💜\n Inteligência artificial que te ajuda aqui no Zap! É um prazer acompanha-lo(a).\n\nPara te auxiliar da melhor forma, me diga de forma precisa qual das opções abaixo você deseja escolher.\n\nNão se esqueça de me marcar em todas as mensagens\n\n${optionsRespond.map((option) => option.show ? `• *${option.message}*\n` : null).join("\n")}\n\nPeça pelo menu, para visualizar o menu principal.`
        client.sendText(message.chatId, messageToSend)
    }, show: false
},
{
    message: "Transcrever áudio", action: async (client: any, message: { chatId: string, author: string }) => {
        const messageToSend = `Pronto, agora é só enviar o áudio pra ser transcrito!`
        client.sendText(message.chatId, messageToSend)
        isNextAudio = true
        lastUser = message.author
    }, show: true
},
{
    message: "GPT me responda", action: async (client: any, message: any, gpt?: GptService) => {
        const dataToFind = message.body.split(" ").slice(1).join(" ")
        const gptResponse = await gpt.getDavinciResponse(dataToFind)
        client.sendText(message.chatId, `Resposta do *ChatGPT-senpai* 🤖: \n ${gptResponse}`)
        isFirst = true
    }, show: false
},
// {
//   message: "Remover membro(s)", action: async (client: any, message: any, gpt?: GptService) => {
//     if (!message.mentionedJidList) {
//       return client.sendText(message.chatId, `Por favor mencione os membros que deseja remover!`)
//     }
//     message.mentionedJidList.map(async (jid: string, index: number) => {
//       if (index === 0) return
//       await client.removeParticipant(message.chatId, jid);
//     })
//     isFirst = true
//   }, show: true
// },
// {
//   message: "Adicionar", action: async (client: any, message: any) => {
//     // const messageToSend = `Pronto, agora é só mencionar !`
//     // client.sendText(message.chatId, messageToSend)
//     // isNextAction = true
//     // lastUser = message.author
//     if (!message.mentionedJidList) {
//       return client.sendText(message.chatId, `Por favor mencione os membros que deseja remover!`)
//     }
//     message.mentionedJidList.map(async (jid: string, index: number) => {
//       if (index === 0) return
//       await client.addParticipant(message.chatId, jid);
//     })
//     isFirst = true
//   }, show: false
// },
{
    message: "GPT crie uma imagem", action: async (client: any, message: any, gpt?: GptService) => {
        const dataToFind = message.body
        const gptResponse = await gpt.getDalleResponse(dataToFind)
        try {
            client.sendImage(message.chatId, gptResponse, 'dall-e-image', `Ta aqui sua imagem gerada pelo GPT 🤖, senpai @${message.author.split("@")[0]}! 💜\nDouitashimashite どう致しまして`)
        } catch (error) {
            console.log(error)
        }
        isFirst = true
    }, show: false
},
{
    message: "Criar imagem com GPT", action: async (client: any, message: any, gpt?: GptService) => {
        const dataToFind = message.body
        const gptResponse = await gpt.getDalleResponse(dataToFind)
        try {
            client.sendImage(message.chatId, gptResponse, 'dall-e-image', `Ta aqui sua imagem gerada pelo GPT 🤖, senpai @${message.author.split("@")[0]}! 💜\nDouitashimashite どう致しまして`)
        } catch (error) {
            console.log(error)
        }
        isFirst = true
    }, show: true
}
];