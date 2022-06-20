import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// MATERIAL MODULES
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoaderComponent } from './components/loader/loader.component';
//LOADER SERVICES
import { LoaderService } from './services/loader.service';
import { LoaderInterceptorService } from './interceptors/loader-interceptor.service';
import { ChartModelsComponent } from './components/chart-models/chart-models.component';
import { ChartMapsComponent } from './components/chart-maps/chart-maps.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ModelComparisonComponent } from './components/model-comparison/model-comparison.component';

@NgModule({
  declarations: [AppComponent, LoaderComponent, ChartModelsComponent, ChartMapsComponent, ModelComparisonComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    HighchartsChartModule 

  ],
  providers: [
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
