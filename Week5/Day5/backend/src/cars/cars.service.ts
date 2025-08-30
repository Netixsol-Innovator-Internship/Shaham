import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from '../schemas/car.schema';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private usersService: UsersService,
    private notificationService: NotificationService,
  ) {}

  async create(createDto: any, userId: string) {
    // Ensure min 6 photos
    if (!createDto.photos || createDto.photos.length < 6) {
      throw new BadRequestException('Please upload at least 6 photos');
    }
    const car = new this.carModel({
      ...createDto,
      seller: userId,
      status: 'draft',
      highestBid: null,
      totalBids: 0,
    });
    const saved = await car.save();
    await this.usersService.addMyCar(userId, saved._id);
    return saved;
  }

  async list(query: any) {
    const q: any = { status: 'active' };
    if (query.make) q.make = query.make;
    if (query.model) q.model = query.model;
    if (query.type) q.type = query.type;
    if (query.minPrice || query.maxPrice) q.startingBid = {};
    if (query.minPrice) q.startingBid.$gte = Number(query.minPrice);
    if (query.maxPrice) q.startingBid.$lte = Number(query.maxPrice);
    return this.carModel.find(q).sort({ createdAt: -1 }).limit(200).exec();
  }

  async listActiveAuctions() {
    return this.carModel.find({ status: 'active' }).sort({ createdAt: -1 }).exec();
  }

  async get(id: string) {
    return this.carModel.findById(id).exec();
  }

  async listBids(carId: string) {
    const car = await this.carModel.findById(carId).exec();
    if (!car) throw new BadRequestException('Car not found');
    return car.bidders || [];
  }

  async startAuction(carId: string, userId: string) {
    const car = await this.carModel.findById(carId).exec();
    if (!car) throw new BadRequestException('Car not found');
    if (car.seller.toString() !== userId.toString()) throw new BadRequestException('Only seller can start the auction');
    if (car.status !== 'draft') throw new BadRequestException('Auction already started or ended');

    car.status = 'active';
    await car.save();

    await this.notificationService.create({
      type: 'Start',
      receiver: null,
      comment: `Auction started for ${car.make} ${car.model}`,
    });

    return car;
  }

  async updateCar(carId: string, body: any, userId: string) {
    const car = await this.carModel.findById(carId).exec();
    if (!car) throw new BadRequestException('Car not found');
    if (car.seller.toString() !== userId.toString()) throw new BadRequestException('Only seller can update the car');
    if (car.status !== 'draft') throw new BadRequestException('Cannot update car after auction has started');

    Object.assign(car, body);
    await car.save();
    return car;
  }

  async removeCar(carId: string, userId: string) {
    const car = await this.carModel.findById(carId).exec();
    if (!car) throw new BadRequestException('Car not found');
    if (car.seller.toString() !== userId.toString()) throw new BadRequestException('Only seller can remove the car');
    if (car.status !== 'draft') throw new BadRequestException('Cannot remove car after auction has started');

    await this.carModel.findByIdAndDelete(carId);
    return { success: true, message: 'Car removed successfully' };
  }

  async endAuction(carId: string, userId: string) {
    const car = await this.carModel.findById(carId).exec();
    if (!car) throw new BadRequestException('Car not found');
    if (car.seller.toString() !== userId.toString()) throw new BadRequestException('Only seller can end the auction');
    if (car.status !== 'active') throw new BadRequestException('Auction not active');

    car.status = 'ended';
    await car.save();

    await this.notificationService.create({
      type: 'End',
      receiver: null,
      comment: `Auction ended for ${car.make} ${car.model}`,
    });

    if (car.highestBid && car.highestBid.userId) {
      await this.notificationService.create({
        type: 'Win',
        receiver: car.highestBid.userId,
        comment: `You won the auction for ${car.make} ${car.model} with ${car.highestBid.amount}`,
      });
    }
    return car;
  }

  async listUserCars(userId: string) {
    return this.carModel.find({ seller: userId }).sort({ createdAt: -1 }).exec();
  }
}
