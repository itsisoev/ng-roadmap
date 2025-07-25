import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth';
import {Router, RouterLink} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LoaderSpinner} from '../../../../shared/components/loader-spinner/loader-spinner';

@Component({
  selector: 'app-login',
  imports: [
    Toast,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    LoaderSpinner,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss', '../../auth.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class Login {
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  authForm = this.fb.group({
    username: this.fb.control('', [Validators.required, Validators.minLength(1)]),
    password: this.fb.control('', [Validators.required, Validators.minLength(3)]),
  });
  isLoading = signal<boolean>(false);

  onSubmit() {
    this.isLoading.set(true);

    const {username, password} = this.authForm.value;
    const userData = {
      username: username ?? '',
      password: password ?? '',
    };

    this.authService.login(userData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.messageService.add({severity: 'success', summary: 'Успех', detail: 'Вы успешно вошли в аккаунт'});
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading.set(false);
          const detail =
            err?.error?.message ||
            err?.message ||
            'Неизвестная ошибка при регистрации';

          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка регистрации',
            detail,
          });
        }
      })
  }
}
