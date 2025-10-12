import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministrationService } from '../../service/administration.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


interface Permission {
  id: string;
  name: string;
  checked?: boolean;
}

interface Section {
  name: string;
  permissions: Permission[];
  checked?: boolean;
}

@Component({
  selector: 'app-role-check-box',
  standalone: false,
  templateUrl: './role-check-box.component.html',
  styleUrl: './role-check-box.component.scss'
})
export class RoleCheckBoxComponent implements OnInit {
  @Input() sections: Section[] = [];
  @Input() selectedRole: Section | null = null;
  @Output() selectedRoleChange = new EventEmitter<Section | null>();


  constructor(private fb: FormBuilder,
    private adminService: AdministrationService,
    private snackbar: SnackbarService,
    private dialogRef: MatDialogRef<RoleCheckBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public dataPrent: any
  ) { }

  ngOnInit(): void {
    console.log('data:', this.dataPrent);
    console.log('data role:');
    console.log(this.dataPrent.role);
    this.getSectionsWithPermissions();

  }


  //  ✅ Cambia todos los hijos al marcar el padre
  toggleAll(section: Section, checked: boolean) {
    section.permissions.forEach(perm => (perm.checked = checked));
    section.checked = checked;
  }

  // ✅ Verifica si todos los hijos están seleccionados
  isAllSelected(section: Section): boolean {
    return section.permissions.every(perm => perm.checked);
  }

  // ✅ Verifica si hay selección parcial
  isIndeterminate(section: Section): boolean {
    const selected = section.permissions.filter(p => p.checked);
    return selected.length > 0 && selected.length < section.permissions.length;
  }

  // ✅ Actualiza el estado del padre cuando cambia un hijo
  onChildChange(section: Section) {
    section.checked = this.isAllSelected(section);
  }

  // ✅ Devuelve los permisos seleccionados
  getSelectedPermissions() {
    const result: Record<string, Permission[]> = {};
    this.sections.forEach(section => {
      const selected = section.permissions.filter(p => p.checked);
      if (selected.length > 0) result[section.name] = selected;
    });
    console.log(result);
    return result;
  }

  getSectionsWithPermissions() {
    this.adminService.getAllSectionsWithPermissions().subscribe({
      next: (data) => {
        this.sections = Object.keys(data.data).map(key => ({
          name: key,
          permissions: data.data[key].map((p: any) => ({ ...p, checked: false })),
          checked: false
        }));

        this.markPermissionsFromRole(this.dataPrent.role.categories, this.dataPrent.role.name);
        console.log('sections:', this.sections);
      },
      error: (err) => {
        console.error('Error al obtener sections:', err);
        this.snackbar.error('Error al obtener sections');
      }
    });
  }

  markPermissionsFromRole(category: any, roleName: string): void {
    this.sections.forEach((section) => {
      section.permissions.forEach((permission) => {
        category.forEach((category: any) => {
          if (category.name === section.name) {
            category.permissions.forEach((permissionCategory: any) => {
              if (permission.id === permissionCategory.id) {
                permission.checked = true;
              }
            });
          }
        });

      });
    });
    console.log('sections:', this.sections);
  }
  onSubmit(): void {
    console.log('sections:', this.dataPrent);
    let resultFiltered = this.sections.map(sec => ({
      ...sec,
      permissions: sec.permissions.filter(p => p.checked)
    }))
      .filter(sec => sec.permissions.length > 0);
    console.log('filteredSections:', resultFiltered);

    let result = { resultFiltered: resultFiltered, role: this.dataPrent.role };

    this.dialogRef.close(result);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }



}
