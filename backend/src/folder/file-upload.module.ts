import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { TableModule } from 'src/table/table.module';
@Module({
  imports: [TableModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule { }
