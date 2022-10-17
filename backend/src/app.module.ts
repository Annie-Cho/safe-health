import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { FoodsModule } from './apis/foods/foods.module';
import 'dotenv/config';
import { UsersModule } from './apis/users/users.module';
import { SubCategoriesModule } from './apis/subCategories/subCategories.module';
import { MainCategoriesModule } from './apis/mainCategories/mainCategories.module';
import { NutriesModule } from './apis/nutries/nutries.module';
import { AuthsModule } from './apis/auths/auths.module';
import { PaymentsModule } from './apis/payments/payments.module';
import { FileModule } from './apis/file/file.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { TokensModule } from './apis/tokens/tokens.module';

@Module({
  imports: [
    AuthsModule,
    FileModule,
    FoodsModule,
    NutriesModule,
    MainCategoriesModule,
    PaymentsModule,
    SubCategoriesModule,
    TokensModule,
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
