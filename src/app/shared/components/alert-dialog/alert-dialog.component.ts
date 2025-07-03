import { Component, Inject , OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-alert-dialog',
  standalone: false,
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent implements OnInit{
  formattedMessage: string = '';
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}


  ngOnInit(): void {
    this.formattedMessage = this.data.message.replace(/\n/g, '<br>');
  }

  onClose(): void {
    this.dialogRef.close(false);
  }


}
