import { Controller, Post, Body, UseGuards, Param, Patch, Delete, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { VariantsService } from './variants.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../utils/cloudinary.service';
import { Express } from 'express';

@Controller('admin/variants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin','super_admin')
export class AdminVariantsController {
  constructor(private variants: VariantsService, private cloud: CloudinaryService) {}

  @Post(':productId')
  async create(@Param('productId') productId: string, @Body() body: any) {
    // body: { color, sku, regularPrice, salePrice, images?: [] }
    return this.variants.create(productId, body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.variants.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.variants.delete(id);
  }

  // upload multiple images for a specific variant id
  @UseInterceptors(FilesInterceptor('files'))
  @Post('upload/:id')
  async upload(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    if (!files || !files.length) throw new BadRequestException('files required');
    const urls = [];
    for (const f of files) {
      // @ts-ignore
      const res: any = await this.cloud.uploadStream(f);
      urls.push(res.secure_url || res.url);
    }
    const v: any = await this.variants.update(id, { $push: { images: { $each: urls } } } as any);
    return { urls, variant: v };
  }
}
