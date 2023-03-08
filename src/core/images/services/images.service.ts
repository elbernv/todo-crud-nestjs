import { join } from 'path';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IMAGE_FOLDERS } from '@core/images/enums/folders.enum';

@Injectable()
export class ImagesService {
  constructor(private readonly configService: ConfigService) {}

  public serveImage(name: string, folder: IMAGE_FOLDERS, response: Response) {
    const file = createReadStream(
      join(process.cwd(), this.configService.get(folder), name),
    );

    this.setHeaders(name, response);

    return new StreamableFile(file);
  }

  private setHeaders(name: string, response: Response) {
    const fileExtesion = name.slice(name.indexOf('.') + 1);
    switch (fileExtesion) {
      case 'png':
        response.setHeader('Content-Type', 'image/png');
        response.setHeader('Content-Disposition', `inline; filename="${name}"`);

        break;

      case 'jpg':
      case 'jpeg':
        response.setHeader('Content-Type', 'image/jpeg');
        response.setHeader('Content-Disposition', `inline; filename="${name}"`);

        break;
    }
  }
}
