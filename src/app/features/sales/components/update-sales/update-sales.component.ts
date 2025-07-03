import { Component,EventEmitter, Output, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-update-sales',
  standalone: false,
  templateUrl: './update-sales.component.html',
  styleUrl: './update-sales.component.scss'
})
export class UpdateSalesComponent  implements OnInit{

  saleId!: string; // ✅ Aquí se almacena el ID recibido
  @Input() saleData?: any;
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private saleService: SalesService, // Inyectamos el servicio
    private router: Router // Para redirigir después de guardar
  ) {}

   ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.saleId = String(params.get('id')); // ✅ Obtener el ID de la URL
      console.log('venta a actualizar:', this.saleId);
      // this.loadProvider();
    });
  }

  updateSale(data: any): void {
    console.log('Datos a actualizar:', data);
    this.saleService.updateSale(this.saleId, data).subscribe({
      next: () => {
        this.snackbar.success('venta editada con éxito')
        this.router.navigate(['/sales/select']);
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this.snackbar.error('❌ Ocurrió un error al actualizar el producto.');
      }
    });
  }

}
