import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from './components/components.module';

const modules = [
  CommonModule,
  ComponentsModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class CoreModule {
}
