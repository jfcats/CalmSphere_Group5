import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Eventoservice } from '../../services/eventoservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [BaseChartDirective, CommonModule], // Importamos BaseChartDirective
  providers: [provideCharts(withDefaultRegisterables())], // Registramos Chart.js
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class ReportesComponent implements OnInit {
  
  // --- GRÁFICO 1: PROFESIONALES (BARRAS) ---
  barChartOptions: ChartOptions = { 
    responsive: true,
    scales: {
      y: {
        ticks: {
          stepSize: 1 // <--- Esto fuerza a contar de 1 en 1
        }
      }
    }
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];
  hasDataProfesional = false;

  // --- GRÁFICO 2: MÉTODOS DE PAGO (DONUT) ---
  donutChartOptions: ChartOptions = { responsive: true };
  donutChartLabels: string[] = [];
  donutChartType: ChartType = 'doughnut';
  donutChartData: ChartDataset[] = [];
  hasDataPagos = false;

  constructor(private eS: Eventoservice) {}

  ngOnInit(): void {
    // Cargar Reporte 1
  this.eS.getReporteProfesional().subscribe({
      next: (data) => {
        console.log("Datos recibidos Profesionales:", data); // <--- OJO AQUÍ
        if(data && data.length > 0) {
          this.hasDataProfesional = true;
          this.barChartLabels = data.map(item => item.nombre);
          this.barChartData = [
            { data: data.map(item => item.cantidad), label: 'Citas Atendidas', backgroundColor: '#8428ff' }
          ];
        } else {
          console.warn("La lista de profesionales llegó vacía.");
        }
      },
      error: (err) => {
        console.error("Error al pedir reporte profesionales:", err); // <--- SI SALE ESTO, ES ERROR 401/403
      }
    });
    // Cargar Reporte 2
    this.eS.getReportePagos().subscribe(data => {
        if(data.length > 0) {
          this.hasDataPagos = true;
          this.donutChartLabels = data.map(item => item.nombre);
          this.donutChartData = [
            { 
                data: data.map(item => item.cantidad), 
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] 
            }
          ];
        }
      });
  }
}