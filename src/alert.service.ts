import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Alert } from './entities/alert.entity';
import { Price } from './entities/price.entity';
import { SetAlertDto } from './dto/set-alert.dto';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkPriceIncrease() {
    console.log('Checking for price increase greater than 3% in the last hour');
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const chains = ['ethereum', 'polygon'];

    for (const chain of chains) {
      const latestPriceRecord = await this.priceRepository.findOne({ where: { chain }, order: { timestamp: 'DESC' } });
      if (latestPriceRecord) {
        const priceOneHourAgoRecord = await this.priceRepository.findOne({ where: { chain, timestamp: MoreThan(oneHourAgo) }, order: { timestamp: 'ASC' } });

        if (priceOneHourAgoRecord) {
          const priceIncrease = ((latestPriceRecord.price - priceOneHourAgoRecord.price) / priceOneHourAgoRecord.price) * 100;
          if (priceIncrease > 3) {
            await this.sendPriceIncreaseEmail(chain, latestPriceRecord.price, priceIncrease);
          }
        }
      }
    }
  }

  async sendPriceIncreaseEmail(chain: string, currentPrice: number, priceIncrease: number) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `Price Increase Alert: ${chain} price increased by ${priceIncrease.toFixed(2)}%`,
      text: `The price of ${chain} has increased by more than 3% in the last hour. Current price: $${currentPrice.toFixed(2)}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Price increase alert email sent for ${chain}`);
    } catch (error) {
      console.error('Failed to send price increase alert email:', error);
    }
  }

  // API to set a price alert for a specific chain and target price
  async setPriceAlert(setAlertDto: SetAlertDto): Promise<Alert> {
    const { chain, targetPrice, email } = setAlertDto;
    // Create a new alert entity
    const newAlert = this.alertRepository.create({ chain, targetPrice, email, fulfilled: false });
    // Save the new alert to the database
    return this.alertRepository.save(newAlert);
  }
}


