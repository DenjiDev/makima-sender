import { Inject, Injectable, Logger } from '@nestjs/common';
import { arrayBufferToStream, bufferToReadableStream, reduceBitrate } from '../common/utils';
import { GptService } from '../gpt/gpt.service';
import { create, Whatsapp } from 'venom-bot'
import { optionsRespond } from './models/option/options';
import { IPayload } from './interfaces/client.interface';


let isFirst = true
let isNextAudio = false
let lastUser: string
@Injectable()
export class ClientService {
  client: Whatsapp
  constructor(private readonly gptService: GptService) {
    this.init()
  }
  async init() {
    create(
      'makima-sender',
      () => { },
      () => { },
      {
        folderNameToken: 'tokens',
        headless: true,
        puppeteerOptions: {
          ignoreDefaultArgs: ['--disable-extensions']
        },
        browserArgs: [
          '--no-sandbox',
          '--disable-setuid-sandbox']
      }
    )
      .then(async (client) => {
        this.client = client
      })
      .catch((error) => {
        Logger.error(error);
      });
  }



  async sendMessage(data: IPayload) {
    const { message, predictions } = data
    const isAudio = message.isAudio
    const isForMakima = message.mentionedJidList.includes(`${process.env.BOT_NUMBER}@c.us`)
    if (isNextAudio && isAudio && lastUser === message.author) {
      await this.transcribeAudio(this.client, message, this.gptService)
    }

    if (isForMakima) {
      const index = predictions[0].index
      await optionsRespond[index].action(this.client, message, this.gptService)
    }

  }

  async sendTranscribe(data: IPayload) {
    const { message } = data
    const isAudio = message.isAudio
    if (isNextAudio && isAudio && lastUser === message.author) {
      await this.transcribeAudio(this.client, message, this.gptService)
    }
  }


  async transcribeAudio(client: Whatsapp, message: any, gpt?: GptService) {
    const buffer = await client.decryptFile(message);
    const inputStream = arrayBufferToStream(buffer);
    const resizedBuffer = await reduceBitrate(inputStream);
    const resizedStream = bufferToReadableStream(resizedBuffer, "audio.mp3");
    const gptResponse = await gpt.transcribe(resizedStream);
    client.sendText(message.chatId, `*Transcrição*: \n ${gptResponse}`)
    isFirst = true
  }


}


