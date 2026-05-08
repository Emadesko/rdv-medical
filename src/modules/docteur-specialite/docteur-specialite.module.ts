import { Module } from '@nestjs/common';
import { DocteurSpecialiteService } from './docteur-specialite.service';
import { DocteurSpecialiteController } from './docteur-specialite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocteurSpecialite } from './entities/docteur-specialite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocteurSpecialite])],
  controllers: [DocteurSpecialiteController],
  providers: [DocteurSpecialiteService],
})
export class DocteurSpecialiteModule {}
