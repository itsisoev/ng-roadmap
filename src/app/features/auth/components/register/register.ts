import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrls: ['./register.scss', '../../auth.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {

}
