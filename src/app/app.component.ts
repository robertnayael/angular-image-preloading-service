import { Component } from '@angular/core';

import { ImagePreloaderService, RandomImageService } from './services';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  preloadPending$ = this.imagePreloader.isBusy$;
  currentBatch = this.randomImage.getBatch(4);

  constructor(
    private imagePreloader: ImagePreloaderService,
    private randomImage: RandomImageService
  ) {}

  onBatchRequested() {
    this.currentBatch = this.randomImage.getBatch(4);
    this.imagePreloader.load(this.currentBatch);
  }
}
