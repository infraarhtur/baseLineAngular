import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-example',
  standalone: false,
  templateUrl: './dialogo-example.component.html',
  styleUrl: './dialogo-example.component.scss'
})
export class DialogoExampleComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogoExampleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close('Cerrado desde el diálogo');
  }

}
