import { Module } from '@nestjs/common';
import { DictionaryController } from './dictionary.controller';

@Module({
    controllers: [DictionaryController]
})
export class DictionaryModule { }
