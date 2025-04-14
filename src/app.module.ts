import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { GlobalJwtGuard } from './common/guards/global-auth.guard';

@Module({
  imports: [UsersModule, MoviesModule, AuthModule, PrismaModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GlobalJwtGuard,
    },
  ],
})
export class AppModule {}
