import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';


@Component({
  selector: 'app-detail-sales',
  standalone: false,
  templateUrl: './detail-sales.component.html',
  styleUrl: './detail-sales.component.scss'
})
export class DetailSalesComponent  implements OnInit{

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
    console.log('Detalle de la venta:', this.saleId);
    // this.loadProvider();
  });
  }

}
