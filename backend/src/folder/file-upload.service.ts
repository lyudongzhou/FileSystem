import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  constructor(private configService: ConfigService) {}

  async clearFolder(url: string) {
    const uploadDir = path.join(
      this.configService.get<string>('UPLOAD_DIR', '/app/uploads'),
      url,
    );
    await fs.rm(uploadDir, { recursive: true, force: true });
    return {
      statusCode: 201,
      message: '成功',
    };
  }

  async uploadFolder(
    url: string,
    files: Express.Multer.File[],
    relativePaths: string[],
  ): Promise<{
    savedFiles: { relativePath: string; savedPath: string; size: number }[];
  }> {
    const uploadDir = path.join(
      this.configService.get<string>('UPLOAD_DIR', '/app/uploads'),
      url,
    );

    // 创建上传目录
    await fs.mkdir(uploadDir, { recursive: true });

    // 保存文件并记录元数据
    const savedFiles: {
      relativePath: string;
      savedPath: string;
      size: number;
    }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = relativePaths[i];

      // 确保相对路径安全
      const safeRelativePath = relativePath
        .split(path.sep)
        .map((part) => path.basename(part))
        .join(path.sep);
      const savedPath = path.join(uploadDir, safeRelativePath);
      const savedDir = path.dirname(savedPath);

      // 创建子目录
      await fs.mkdir(savedDir, { recursive: true });
      // 保存文件
      await fs.writeFile(savedPath, file.buffer);

      // 记录元数据
      savedFiles.push({
        relativePath: safeRelativePath,
        savedPath,
        size: file.size,
      });
    }

    return { savedFiles };
  }
}
