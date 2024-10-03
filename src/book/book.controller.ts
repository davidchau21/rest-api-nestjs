import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('book')
export class BookController {
    constructor(private bookService: BookService) {}

    @Get()
    @Roles(Role.Moderator, Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
        return this.bookService.findAll(query);
    }

    @Post()
    @UseGuards(AuthGuard())
    async createBook(
        @Body() book: CreateBookDto,
        @Req() req,
    ): Promise<Book> {
        return this.bookService.create(book, req.user);
    }

    @Get(':id')
    async getBookById(
        @Param('id') id: string,
    ): Promise<Book> {
        return this.bookService.findById(id);
    }

    @Put(':id')
    async updateBookById(
        @Param('id') id: string,
        @Body() book: UpdateBookDto,
    ): Promise<Book> {
        return this.bookService.updateById(id, book);
    }

    @Delete(':id')
    async deleteBook(
        @Param('id') id: string,
    ): Promise<Book> {
        return this.bookService.deleteById(id);
    }
}
