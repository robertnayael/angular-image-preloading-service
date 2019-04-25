import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import Services from './services';
import Components from './components';
import { RemFromAspectRatioDirective } from './app-rem-from-aspect-ratio';

import { AppComponent } from './app.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, ...Components, RemFromAspectRatioDirective ],
  bootstrap:    [ AppComponent ],
  providers:    [ ...Services ]
})
export class AppModule { }
