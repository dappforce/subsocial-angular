import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ThemeModule} from '../theme/theme.module';
import { PostCardComponent } from './post-card/post-card.component';


@NgModule({
  declarations: [
    PostCardComponent
  ],
  imports: [
    ReactiveFormsModule,
    ThemeModule
  ],
    exports: [
        ReactiveFormsModule,
        ThemeModule,
        PostCardComponent
    ]
})
export class ComponentsModule {
}
