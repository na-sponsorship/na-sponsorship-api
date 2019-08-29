import { Module } from '@nestjs/common';
import { ChildrenController } from './controllers/children.controller';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child } from '../../entities/child.entity';
import { Sponsor } from '../../entities/sponsor.entity';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryStorage } from './storage-providers/cloudinary.storage';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => {
        return {
          storage: CloudinaryStorage,
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
