import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TableService } from './table.service';
import { UsersController } from './table.controller';
import { Table, TableSchema } from './table.schema';
import { UsersModule } from '../users/users.module';
import { FileUploadModule } from '../folder/file-upload.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
    UsersModule,
    forwardRef(() => FileUploadModule),
  ],
  providers: [TableService],
  controllers: [UsersController],
  exports: [TableService],
})
export class TableModule {}
