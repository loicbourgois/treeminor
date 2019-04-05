import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaygroundComponent } from './playground/playground.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditorComponent } from './editor/editor.component';
import { SimulationComponent } from './simulation/simulation.component';
import { DemoComponent } from './demo/demo.component';
import { DemosComponent } from './demos/demos.component';
import { PrettyJsonPipe } from './pretty-json.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundComponent,
    HomeComponent,
    PageNotFoundComponent,
    EditorComponent,
    SimulationComponent,
    DemoComponent,
    DemosComponent,
    PrettyJsonPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
