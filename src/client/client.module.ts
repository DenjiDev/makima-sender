import { Module } from '@nestjs/common';
import { ClientService } from './client.service';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from '../gpt/gpt.module';
import { ClientHandler } from './client.handler';
import { BullModule } from '@nestjs/bull';


@Module({
  imports: [
    ConfigModule.forRoot(),
    GptModule,
    BullModule.registerQueue({
      name: 'sender',
    })
    // ClientsModule.register([
    //   {
    //     name: 'MAKIMA',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env.RABBIT_URL],
    //       queue: 'engine_queue',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     }
    //   },
    // ]),

  ],
  providers: [ClientService, ClientHandler],
})
export class ClientModule { }
