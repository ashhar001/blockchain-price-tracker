import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import axios from 'axios';
import { Price } from './entities/price.entity';

@Injectable()
export class PriceService {
  private moralisApiKey = process.env.MORALIS_API_KEY;

  private ethereumContractAddress = '0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // WETH contract address
  private polygonContractAddress = '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0';

  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  // Fetch price from Moralis API
  async fetchPrice(chain: 'ethereum' | 'polygon'): Promise<number | null> {
    try {
      const contractAddress = chain === 'ethereum' ? this.ethereumContractAddress : this.polygonContractAddress;
      const response = await axios.get(`https://deep-index.moralis.io/api/v2/erc20/${contractAddress}/price?chain=eth`, {
        headers: {
          'X-API-Key': this.moralisApiKey,
        },
      });
      return response.data.usdPrice;
    } catch (error) {
      console.error(`Failed to fetch price for ${chain}:`, error);
      return null;
    }
  }

  // Cron job to fetch prices every 5 minutes
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    console.log('Fetching prices for Ethereum and Polygon');
    const ethPrice = await this.fetchPrice('ethereum');
    const polygonPrice = await this.fetchPrice('polygon');

    if (ethPrice) {
      await this.priceRepository.save({ chain: 'ethereum', price: ethPrice });
    }
    if (polygonPrice) {
      await this.priceRepository.save({ chain: 'polygon', price: polygonPrice });
    }
  }

  // API to get hourly prices for last 24 hours
  async getHourlyPrices(chain: 'ethereum' | 'polygon'): Promise<Price[]> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.priceRepository.find({ where: { chain, timestamp: MoreThan(twentyFourHoursAgo) }, order: { timestamp: 'ASC' } });
  }

  // API to get swap rate ETH to BTC
  async getSwapRate(ethAmount: number): Promise<{ btcAmount: number; feeEth: number; feeUsd: number }> {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd');
      const ethPrice = response.data.ethereum.usd;
      const btcPrice = response.data.bitcoin.usd;
      const btcAmount = (ethAmount * ethPrice) / btcPrice;
      const feeEth = ethAmount * 0.03;
      const feeUsd = feeEth * ethPrice;

      return { btcAmount, feeEth, feeUsd };
    } catch (error) {
      throw new HttpException('Failed to fetch swap rate', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
