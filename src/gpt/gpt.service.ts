import { Injectable } from '@nestjs/common';
import { Configuration, CreateImageRequestSizeEnum, OpenAIApi } from "openai"
import * as fs from "fs"

@Injectable()
export class GptService {
  private configuration: Configuration
  private openAi: OpenAIApi
  constructor() {
    this.configuration = new Configuration({
      organization: "org-9N03nkPvfRWFgIMtUTVN8IpE",
      apiKey: "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",
    })
    this.openAi = new OpenAIApi(this.configuration)
  }
  async getDavinciResponse(userText: string) {
    const options = {
      model: "text-davinci-003",
      prompt: userText,
      temperature: 1,
      max_tokens: 4000
    }

    try {
      const response = await this.openAi.createCompletion(options)
      let botResponse = ""
      response.data.choices.forEach(({ text }) => {
        botResponse += text
      })
      return `${botResponse.trim()}`
    } catch (e) {
      throw `❌ OpenAI Response Error: ${e.response.data.error.message}`
    }
  }

  async getDalleResponse(userText: string) {
    const options = {
      prompt: userText,
      n: 1,
      size: "1024x1024" as CreateImageRequestSizeEnum
    }

    try {
      const response = await this.openAi.createImage(options);
      return response.data.data[0].url
    } catch (e) {
      throw `❌ OpenAI Response Error: ${e.response.data.error.message}`
    }
  }

  async transcribe(buffer: any) {
    try {
      const { data } = await this.openAi.createTranscription(buffer, "whisper-1", "", "json", 1, "pt")
      return data.text
    } catch (e) {
      throw `❌ OpenAI Response Error: ${e.response.data.error.message}`
    }
  }
}
