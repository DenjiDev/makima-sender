import { GptService } from "src/gpt/gpt.service";

export interface IOption {
    message: string,
    action: (client: any, message: any, gptService?: GptService) => Promise<void>,
    show: boolean
}