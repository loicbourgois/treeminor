import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DemosComponent } from './demos/demos.component';
import { DemoComponent } from './demo/demo.component';

const routes: Routes = [
  {path: '',   redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'playground', component: PlaygroundComponent},
  {path: 'demos', redirectTo: '/demo/point', pathMatch: 'full'},
  {
    path: 'demo',
    component: DemosComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'point' },
      { path: ':id', component: DemoComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
