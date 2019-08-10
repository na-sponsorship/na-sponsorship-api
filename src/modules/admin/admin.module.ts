import { Module } from '@nestjs/common';
import { ChildrenController } from './controllers/children.controller';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child } from '../../entities/child.entity';
import { Sponsor } from '../../entities/sponsor.entity';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { DiskStorage } from './storage-providers/disk.storage';
import { S3Storage } from './storage-providers/s3.storage';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => {
        return {
          storage: process.env.NODE_ENV === 'local' ? DiskStorage : S3Storage,
        };
      },
    }),
    SharedModule,
    AuthModule,
    TypeOrmModule.forFeature([Child, Sponsor]),
  ],
  controllers: [ChildrenController],
  providers: [],
})
export class AdminModule {}
