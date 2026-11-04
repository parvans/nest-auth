import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UsersService } from 'src/users/users.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private userService: UsersService) {}

  @Get('users')
  @ApiOperation({ summary: 'List all users - Admin only' })
  getUsers() {
    return this.userService.findAll();
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user - Admin only' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
