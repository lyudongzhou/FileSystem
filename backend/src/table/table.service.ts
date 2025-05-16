import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from './table.schema';
import { v4 } from 'uuid';
@Injectable()
export class TableService {
  constructor(@InjectModel(Table.name) private tableModel: Model<Table>) {}
  async createTable(userName: string, tableName: string, description: string) {
    const existingTable = await this.tableModel.findOne({
      name: tableName,
      userName,
    });
    if (existingTable) {
      throw new ConflictException('表格已存在');
    }
    console.log(userName);
    const table = new this.tableModel({
      userName,
      name: tableName,
      description,
      url: v4(),
    });
    return table.save();
  }
  async findTableList(
    {
      page = 1,
      limit = 10,
    }: {
      page?: number;
      limit?: number;
    },
    userName: string,
  ) {
    const tableList = await this.tableModel
      .find({ userName })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return tableList;
  }
  async deleteTable(tableName: string) {
    const existingTable = await this.tableModel.findOne({ name: tableName });
    if (!existingTable) {
      throw new ConflictException('表格不存在');
    }
    existingTable.deleteOne();
    return existingTable;
  }
}
