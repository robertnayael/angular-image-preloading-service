import { Injectable, OnDestroy } from '@angular/core';
import { concat, fromEvent, of, Subject, Subscription } from 'rxjs';
import {
  catchError,
  distinct,
  distinctUntilChanged,
  map,
  mapTo,
  mergeMap,
  scan,
  shareReplay,
  startWith, tap
} from 'rxjs/operators';

const COUNTER = {
  INCREASE: 1,
  DECREASE: -1,
};

@Injectable()
export class ImagePreloaderService implements OnDestroy {

  static enqueueImage(url: string) {
    const image = new Image;
    image.src = url;
    return fromEvent(image, 'load')
        .pipe(
          mapTo(COUNTER.DECREASE),
          startWith(COUNTER.INCREASE),
          catchError(() => of(COUNTER.DECREASE))
        );
  }

  private urls$ = new Subject<string>();
  
  private queue$ = this.urls$.pipe(
    distinct(),
    mergeMap(ImagePreloaderService.enqueueImage),
    scan((total, current) => total + current, 0)
  );

  private preloadPending$ = this.queue$.pipe(
    map(queueLength => queueLength > 0),
    distinctUntilChanged(),
    shareReplay(1)
  );

  private subscription = this.preloadPending$.subscribe();

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /** Register images to preload */
  load(urls: string[]) {
    urls.forEach(asset => this.urls$.next(asset));
  }

  /** Emits `true` if any images are pending, otherwise `false`. */
  get isBusy$() {
    return this.preloadPending$;
  }


}
