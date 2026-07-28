import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './presentation/http/auth/auth.module';
import { ProductsModule } from './presentation/http/products/products.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // ── Variables de entorno ────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),

    // ── Base de datos ───────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions =>
        config.get<TypeOrmModuleOptions>('database')!,
    }),

    AuthModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
