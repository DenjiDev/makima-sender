import { Whatsapp } from "venom-bot"

interface IMessage {
    isAudio: boolean
    mentionedJidList: string[]
    author: string
}

interface Prediction {
    similarity: number
    result: string
    index: number
}

export interface IPayload {
    message: IMessage
    predictions: Prediction[]
}