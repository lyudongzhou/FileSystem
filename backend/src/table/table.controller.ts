import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TableService } from './table.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('table')
export class UsersController {
  constructor(private tableService: TableService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createTable(
    @CurrentUser() user: { username: string },
    @Body() body: { name: string; description: string },
  ) {
    return this.tableService.createTable(
      user.username,
      body.name,
      body.description,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('delete')
  async deleteTable(
    @Body() body: { name: string },
    @CurrentUser() user: { username: string },
  ) {
    return this.tableService.deleteTable(body.name, user.username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async findTableList(
    @CurrentUser() user: { username: string },
    @Body() body: { page: number; limit: number },
  ) {
    return this.tableService.findTableList(body, user.username);
  }
}
