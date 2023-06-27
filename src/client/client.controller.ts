import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ClientService } from './client.service';
import { IPayload } from './interfaces/client.interface';

@Controller()
export class ClientController {
    constructor(private readonly clientService: ClientService) {

    }

    @EventPattern('sender')
    async handleSendMessage(@Payload() data: any, @Ctx() context: RmqContext) {
        const dataToSend = JSON.parse(data)
        Logger.log(dataToSend)
        this.clientService.sendMessage(dataToSend.data)
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        channel.ack(originalMessage);
    }

}