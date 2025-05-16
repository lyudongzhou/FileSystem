import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TableService } from './table.service';

@Controller('table')
export class UsersController {
  constructor(private tableService: TableService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createTable(
    @Request() req: Request & { user: { id: string; username: string } },
    @Body() body: { name: string; description: string },
  ) {
    return this.tableService.createTable(
      req.user.username,
      body.name,
      body.description,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('delete')
  async deleteTable(@Body() body: { name: string }) {
    return this.tableService.deleteTable(body.name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async findTableList(
    @Request() req: Request & { user: { id: string; username: string } },
  ) {
    const currentUser = req.user;
    return this.tableService.findTableList({}, currentUser.username);
  }
}
