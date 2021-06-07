import {NgModule} from '@angular/core';

import {SpacesRoutingModule} from './spaces-routing.module';
import {SpaceListPageComponent} from './pages/space-list-page/space-list-page.component';
import {SpacePageComponent} from './pages/space-page/space-page.component';
import {CoreModule} from '../../core/core.module';
import { SpaceCardComponent } from './components/space-card/space-card.component';


@NgModule({
  declarations: [
    SpaceListPageComponent,
    SpacePageComponent,
    SpaceCardComponent
  ],
  imports: [
    CoreModule,
    SpacesRoutingModule
  ]
})
export class SpacesModule {
}
