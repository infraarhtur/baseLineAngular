import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  providerData: any;

  constructor(
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private salesService: SalesService, // Inyectamos el servicio
    private router: Router // Para redirigir después de guardar
  ) {}

   ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.saleId = String(params.get('id')); // ✅ Obtener el ID de la URL
      console.log('venta a actualizar:', this.saleId);
      // this.loadProvider();
    });
  }
}
