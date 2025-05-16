import { Injectable } from '@nestjs/common';
import { join, dirname } from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class FileUploadService {
  async saveFolder(files: Array<Express.Multer.File>, username: string) {
    const uploadDir = join(process.cwd(), 'uploads', username, randomUUID());

    try {
      // 保存所有文件并保持目录结构
      const savedFiles = await Promise.all(
        files.map(async (file) => {
          // 解析文件的相对路径（originalname 可能包含路径，如 folder/subfolder/file.txt）
          const relativePath = file.originalname.replace(/\\/g, '/'); // 统一路径分隔符
          const filePath = join(uploadDir, relativePath);

          // 创建文件的父目录
          await fs.mkdir(dirname(filePath), { recursive: true });

          // 保存文件
          await fs.writeFile(filePath, file.buffer);

          return {
            filename: file.originalname,
            path: filePath,
            size: file.size,
          };
        }),
      );

      return {
        message: 'Folder uploaded successfully',
        folder: uploadDir,
        files: savedFiles,
      };
    } catch (error) {
      // 如果发生错误，清理已创建的目录
      await fs.rm(uploadDir, { recursive: true, force: true }).catch(() => {});
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to upload folder: ${error.message}`);
    }
  }
}
