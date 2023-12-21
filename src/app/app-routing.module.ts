import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SearchComponent } from './pages/search/search.component';
import { AuthComponent } from './auth/auth.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DownloadMoviesComponent } from './pages/download-movies/download-movies.component';
import { UserAuthGuard } from './guard/user-auth.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'search/:input', component: SearchComponent},
  {path: 'movie/:id', component: MovieDetailsComponent},
  {path: 'download/:movieid', canActivate: [UserAuthGuard], component: DownloadMoviesComponent},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModules)},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  {path: '**', component: NotFoundComponent}
];

// interface NgxSpinnerConfig {
//   type?: string;
// }

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
    // NgxSpinnerModule.forRoot({ type: 'square-jelly-box' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
