import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './pages/home/home.component';
import { AsideBarComponent } from './partials/aside-bar/aside-bar.component';
import { HeaderComponent } from './partials/header/header.component';
import {MatTableModule} from '@angular/material/table';
import { NgChartsModule } from 'ng2-charts';
import { AnalyticDataComponent } from './partials/analytic-data/analytic-data.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './partials/footer/footer.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';


@NgModule({
  declarations: [
    AdminComponent,
    HomeComponent,
    AsideBarComponent,
    HeaderComponent,
    AnalyticDataComponent,
    FooterComponent,
    ChangePasswordComponent,
    InboxComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgChartsModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFireDatabaseModule,
  ]
})
export class AdminModule { }
