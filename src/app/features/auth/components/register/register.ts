import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../../../core/services/auth';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Toast} from 'primeng/toast';
import {LoaderSpinner} from '../../../../shared/components/loader-spinner/loader-spinner';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Toast,
    RouterLink,
    LoaderSpinner
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss', '../../auth.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class Register {
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

    this.authService.register(userData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.messageService.add({severity: 'success', summary: 'success', detail: 'Вы успешно вошли в аккаунт'});
          this.router.navigate(['/']);
        },
        error: (err) => {
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
