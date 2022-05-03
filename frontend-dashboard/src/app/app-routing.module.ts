import { ChartMapsComponent } from './components/chart-maps/chart-maps.component';
import { ChartModelsComponent } from './components/chart-models/chart-models.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path:'', redirectTo:'/chart', pathMatch:'full'},
  { path: 'chart', component: ChartModelsComponent },
  {path: 'map', component:ChartMapsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
   declarations: [

  ]
})
export class AppRoutingModule { }
