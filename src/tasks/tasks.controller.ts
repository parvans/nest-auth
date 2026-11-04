import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { User } from 'src/db/schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the authenticated user' })
  findAll(@CurrentUser() user: User) {
    return this.tasksService.findAllForUser(user.id);
  }
  @Post()
  @ApiOperation({ summary: 'Create new task' })
  create(@CurrentUser() user: User, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task by the authenticated user' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: Partial<CreateTaskDto>,
  ) {
    return this.tasksService.updateTask(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by the authenticated user' })
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.deleteTask(id, user.id);
  }
}
