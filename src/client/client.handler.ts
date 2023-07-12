import { Controller, Injectable, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ClientService } from './client.service';
import { IPayload } from './interfaces/client.interface';
import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Job } from 'bull';

@Injectable()
@Processor('sender')
export class ClientHandler {
    constructor(private readonly clientService: ClientService) {

    }

    @Process("sender")
    @OnQueueActive()
    async handleSendMessage(job: Job) {
        const dataToSend = JSON.parse(job.data)
        Logger.log(dataToSend)
        this.clientService.sendMessage(dataToSend.data)
    }

    @Process("transcribe")
    @OnQueueActive()
    async handleTranscribeAudio(job: Job) {
        const dataToSend = JSON.parse(job.data)
        Logger.log(dataToSend)
        this.clientService.sendTranscribe(dataToSend.data)
    }

}