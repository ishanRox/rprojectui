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
import { vehicalReducer } from './state/vehicalstate/vehical.reducer';
import { SearchByModelComponent } from './search-by-model/search-by-model.component';
import { mainReducer } from './state/main.reducer';
import { UpdateComponentComponent } from './update-component/update-component.component';
import { DeleteComponentComponent } from './delete-component/delete-component.component';
import { VehicalComponentComponent } from './vehical-component/vehical-component.component';
import { NotificationComponentComponent } from './notification-component/notification-component.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    DownloadComponent,
    SearchbyidComponent,
    SearchByModelComponent,
    UpdateComponentComponent,
    DeleteComponentComponent,
    VehicalComponentComponent,
    NotificationComponentComponent
  ],
  imports: [
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added

    StoreModule.forRoot({
      getV: vehicalReducer,
      main: mainReducer

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
