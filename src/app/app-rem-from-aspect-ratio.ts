import { DOCUMENT } from '@angular/common';
import { Directive, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { Component, Inject, Renderer2 } from '@angular/core';

import { ReplaySubject, fromEvent, Observable, Subscription, combineLatest } from 'rxjs';
import { map, startWith, pluck } from 'rxjs/operators';

interface AspectRatio {
  x: number,
  y: number
}

interface ViewportSize {
  width: number,
  height: number
}
 
@Directive({
  selector: '[appRemFromAspectRatio]',
})
export class RemFromAspectRatioDirective implements OnInit, OnDestroy {
  private aspectRatio$: ReplaySubject<AspectRatio> = new ReplaySubject(1);
  private viewportSize$: Observable<ViewportSize>;
  private subscription: Subscription;

  @Input()
  set appRemFromAspectRatio(aspectRatio: string) {
    try {
      const [match, x, y ] = aspectRatio.match(/^(\d+):(\d+)$/);
      this.aspectRatio$.next({ x: +x, y: +y });
    } catch {
      throw new Error(`Could not determine aspect ratio: "${aspectRatio}"`);
    }
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.viewportSize$ = fromEvent(window, 'resize').pipe(
      pluck('target'),
      startWith(window),
      map((window: Window) => ({
        width: window.innerWidth,
        height: window.innerHeight
      }))
    )

    this.subscription = combineLatest(
      this.viewportSize$,
      this.aspectRatio$
    )
      .pipe(this.calculateRem)
      .subscribe(this.applyRem)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private calculateRem = (source$: Observable<[ ViewportSize, AspectRatio ]>) =>
    source$.pipe(
      map(([ vp, ar]) => {
        const targetRatio = ar.x / ar.y;
        const currentRatio = vp.width / vp.height;
        const contentWidth = targetRatio < currentRatio
          ? vp.height * targetRatio
          : vp.width;
        return contentWidth / 100;
      })
    )

  private applyRem = (fontSize: number) => {
    this.renderer.setStyle(this.document.body.parentNode, 'fontSize', `${fontSize}px`);
  }

}
