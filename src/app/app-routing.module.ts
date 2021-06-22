import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {ChatComponent} from "./components/chat/chat.component";
import {GameComponent} from "./components/game/game.component";

const routes: Routes = [{
  path: '', redirectTo: '/login', pathMatch: 'full'
}, {
  path: 'home', component: HomeComponent
}, {
  path: 'login', component: LoginComponent
}, {
  path: 'chat', component: ChatComponent
}, {
  path: 'game', component: GameComponent
}, {
  path: '**', component: PageNotFoundComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
