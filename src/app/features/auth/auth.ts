import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'features-auth',
  imports: [
    RouterOutlet
  ],
  template: `
    <router-outlet></router-outlet>
  `,

})
export class Auth {
}
