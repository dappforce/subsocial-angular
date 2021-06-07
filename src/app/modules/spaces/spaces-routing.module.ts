import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SpaceListPageComponent} from './pages/space-list-page/space-list-page.component';
import {SpacePageComponent} from './pages/space-page/space-page.component';

const routes: Routes = [
  {path: '', component: SpaceListPageComponent},
  {path: ':spaceId', component: SpacePageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpacesRoutingModule {
}
