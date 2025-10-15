import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: false,
})
export class HasPermissionDirective {
  private permission!: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set appHasPermission(permission: string) {
    console.log('Setting permission:', permission);
    this.permission = permission;
    this.updateView();
  }

  private updateView() {
      if (this.authService.hasPermission(this.permission)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
  }
}
