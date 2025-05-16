import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TableModule } from './table/table.module';
import { FileUploadModule } from './folder/file-upload.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/user', {
      // MongoDB Atlas 示例：mongodb+srv://username:password@cluster0.mongodb.net/your_database
    }),
    UsersModule,
    AuthModule,
    TableModule,
    FileUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
