import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bid, BidDocument } from '../schemas/bid.schema';
import { Car, CarDocument } from '../schemas/car.schema';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notifications.service';
import { AuctionGateway } from '../gateways/auction.gateway';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private usersService: UsersService,
    private notificationService: NotificationService,
    private gateway: AuctionGateway,
  ) { }

  async placeBid(carId: string, userId: string, amount: number) {
    const car = await this.carModel.findById(carId).exec();
    if (!car) throw new BadRequestException('Car not found');
    if (car.seller.toString() === userId.toString()) throw new ForbiddenException('Cannot bid on your own car');
    if (car.status !== 'active') throw new BadRequestException('Auction not active');
    const current = car.highestBid ? car.highestBid.amount : car.startingBid;
    const minRequired = current + (car.minimumIncrement || 100);
    if (amount < minRequired) throw new BadRequestException(`Bid too low. Minimum required is ${minRequired}`);
    // create bid
    const bid = new this.bidModel({ car: carId, user: userId, amount });
    const saved = await bid.save();
    // update car
    car.highestBid = { userId, amount, bidId: saved._id };
    car.totalBids = (car.totalBids || 0) + 1;
    car.bidders = car.bidders || [];
    car.bidders.push({ userId, amount, bidId: saved._id });
    await car.save();
    // add to user bids
    await this.usersService.addMyBid(userId, saved._id);
    // create notifications for bidders only (exclude the bidder who placed this bid)
    const bidderIds = new Set<string>();
    (car.bidders || []).forEach((b: any) => {
      if (b.userId?.toString && b.userId.toString() !== userId.toString()) {
        bidderIds.add(b.userId.toString());
      }
    });
    for (const bidderId of bidderIds) {
      await this.notificationService.create({
        type: 'New',
        receiver: new Types.ObjectId(bidderId),
        comment: `New bid ${amount} on ${car.make} ${car.model}`,
      });
    }
    // notify clients
    this.gateway.server && this.gateway.server.emit('notificationsUpdated');
    // emit via socket gateway
    this.gateway.server && this.gateway.server.to(carId.toString()).emit('newBid', { carId, userId, amount, bidId: saved._id });
    return saved;
  }
  async listForUser(userId: string) {
    return this.bidModel
      .find({ user: userId })
      .populate('car')
      .exec();
  }

  async listForCar(carId: string) {
    return this.bidModel.find({ car: carId }).sort({ createdAt: -1 }).limit(200).exec();
  }
}
