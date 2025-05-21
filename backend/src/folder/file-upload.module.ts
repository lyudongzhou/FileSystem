import { Module, forwardRef } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { TableModule } from 'src/table/table.module';
@Module({
  imports: [forwardRef(() => TableModule)],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
