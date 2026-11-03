import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  controllers: [],
  providers: [UsersService],
  exports: [UsersService], // this exports over here makes this user service injectable into other modules
})
export class UsersModule {}
