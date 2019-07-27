import { Module } from '@nestjs/common';
import { ChildrenController } from './controllers/children.controller';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child } from 'src/entities/child.entity';
import { Sponsor } from 'src/entities/sponsor.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Child, Sponsor])],
  controllers: [ChildrenController],
  providers: [],
})
export class AdminModule {}
