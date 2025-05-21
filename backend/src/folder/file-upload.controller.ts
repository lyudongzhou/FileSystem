import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Body,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { TableService } from 'src/table/table.service';

@Controller('upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private tableService: TableService,
  ) {}

  @Post('folder')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFolder(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('paths') paths: string,
    @Body('tableName') tableName: string,
    @CurrentUser() user: { username: string },
  ) {
    if (!tableName) {
      throw new ConflictException('表格名称不能为空');
    }
    if (!files.length || !paths) {
      throw new ConflictException('未提供文件或路径');
    }
    const url = await this.tableService.findUrl(tableName, user.username);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const relativePaths = JSON.parse(paths); // 解析 paths 为数组
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (files.length !== relativePaths.length) {
      throw new ConflictException('文件数量与路径数量不匹配');
    }

    const result = await this.fileUploadService.uploadFolder(
      url,
      files,
      relativePaths,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: '文件夹上传成功',
      data: result,
    };
  }
  @Post('clear')
  @UseGuards(AuthGuard('jwt'))
  async clearFolder(
    @Body('tableName') tableName: string,
    @CurrentUser() user: { username: string },
  ) {
    if (!tableName) {
      throw new ConflictException('表格名称不能为空');
    }
    const url = await this.tableService.findUrl(tableName, user.username);
    return this.fileUploadService.clearFolder(url);
  }
}
