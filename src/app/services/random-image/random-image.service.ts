import { Injectable } from '@angular/core';
import sampleSize from 'lodash.samplesize';

import images from '../../assets';

@Injectable()
export class RandomImageService {

  getBatch(batchSize: number): string[] {
    return sampleSize(images, batchSize);
  }

}
