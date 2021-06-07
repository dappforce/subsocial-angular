import {Component} from '@angular/core';
import {IndexeddbService} from './core/services/indexeddb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private idb: IndexeddbService) {
  }
}
