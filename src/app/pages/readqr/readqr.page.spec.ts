import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadqrPage } from './readqr.page';

describe('ReadqrPage', () => {
  let component: ReadqrPage;
  let fixture: ComponentFixture<ReadqrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadqrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
