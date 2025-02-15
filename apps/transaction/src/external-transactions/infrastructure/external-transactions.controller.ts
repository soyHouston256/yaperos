import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateExternalTransactionDto } from './dto';
import { ExternalTransactionsService } from '../application/external-transactions.service';
import { TransactionSerializerInterceptor } from './interceptors';
import { ExternalTransaction } from '../domain/external-transaction.entity';

@Controller('external-transactions')
export class ExternalTransactionsController {
  constructor(
    private readonly externalTransactionsService: ExternalTransactionsService,
  ) {}

  @Post()
  @UseInterceptors(TransactionSerializerInterceptor)
  create(
    @Body() dto: CreateExternalTransactionDto,
  ): Promise<ExternalTransaction> {
    return this.externalTransactionsService.create(dto);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @UseInterceptors(TransactionSerializerInterceptor)
  async findOne(@Param('id') id: string): Promise<ExternalTransaction> {
    const externalTransaction = await this.externalTransactionsService.findById(
      id,
    );

    if (!externalTransaction) {
      throw new NotFoundException('Transaction not found');
    }

    return externalTransaction;
  }
}
