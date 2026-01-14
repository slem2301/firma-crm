import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { PrismaModule } from './prisma/prisma.module';
import { TypesModule } from './types/types.module';
import { ProductsModule } from './products/products.module';
import { OtypesModule } from './otypes/otypes.module';
import { ProjectsModule } from './projects/projects.module';
import { StatisticksModule } from './statisticks/statisticks.module';
import { PriceModule } from './price/price.module';

@Module({
  imports: [AuthModule, UsersModule, OrdersModule, DictionaryModule, PrismaModule, TypesModule, ProductsModule, OtypesModule, TypesModule,
    ProjectsModule, StatisticksModule, PriceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
