import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { UploadComponent } from './upload/upload.component';
import { DownloadComponent } from './download/download.component';
import { SearchbyidComponent } from './searchbyid/searchbyid.component';
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './state/counter.reducer';
import { vehicalReducer } from './state/vehicalstate/vehical.reducer';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    DownloadComponent,
    SearchbyidComponent
  ],
  imports: [StoreModule.forRoot({
    getV:vehicalReducer,
    count: counterReducer
   
  }),
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
