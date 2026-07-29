import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  saveFile(file: Express.Multer.File): string {
    return `/uploads/products/${file.filename}`;
  }
}
