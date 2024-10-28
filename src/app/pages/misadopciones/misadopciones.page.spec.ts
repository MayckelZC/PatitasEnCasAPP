import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisAdopcionesPage } from './misadopciones.page';

describe('MisadopcionesPage', () => {
  let component: MisAdopcionesPage;
  let fixture: ComponentFixture<MisAdopcionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisAdopcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
