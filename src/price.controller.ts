import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { PriceService } from './price.service';
import { AlertService } from './alert.service';
import { SetAlertDto } from './dto/set-alert.dto';


@Controller('price')
export class PriceController {
  constructor(
    private readonly priceService: PriceService,
    private readonly alertService: AlertService,
  ) {}

  @Get('hourly')
  async getHourlyPrices(@Query('chain') chain: 'ethereum' | 'polygon') {
    return this.priceService.getHourlyPrices(chain);
  }

  @Get('swap-rate')
  async getSwapRate(@Query('ethAmount') ethAmount: number) {
    return this.priceService.getSwapRate(ethAmount);
  }

  @Post('set-alert')
  async setPriceAlert(@Body() setAlertDto: SetAlertDto) {
    return this.alertService.setPriceAlert(setAlertDto);
  }
}
