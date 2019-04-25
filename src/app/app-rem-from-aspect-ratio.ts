import { Directive, Input } from '@angular/core';
 
@Directive({
  selector: '[appRemFromAspectRatio]'
})
export class RemFromAspectRatioDirective {
  private aspectRatio: { x: number, y: number };

  @Input()
  set appRemFromAspectRatio(aspectRatio: string) {
    try {
      const [match, x, y ] = aspectRatio.match(/^(\d+):(\d+)$/);
      this.aspectRatio = { x: +x, y: +y };
    } catch {
      throw new Error(`Could not determine aspect ratio: "${aspectRatio}"`);
    }
  }

  constructor() {
  }
}
