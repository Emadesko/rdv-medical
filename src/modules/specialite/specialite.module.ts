import { Module } from '@nestjs/common';
import { SpecialiteService } from './specialite.service';
import { SpecialiteController } from './specialite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialite } from './entities/specialite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialite])],
  controllers: [SpecialiteController],
  providers: [SpecialiteService],
})
export class SpecialiteModule {}
