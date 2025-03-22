import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-clients',
  standalone: false,
  templateUrl: './update-clients.component.html',
  styleUrl: './update-clients.component.scss'
})
export class UpdateClientsComponent implements OnInit {
  clientId!: string; // ✅ Aquí se almacena el ID recibido

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.clientId = String(params.get('id')); // ✅ Obtener el ID de la URL
      console.log('Cliente a actualizar:', this.clientId);
    });
  }
}
