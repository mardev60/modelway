import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelesPageComponent } from './modeles-page.component';

describe('ModelesPageComponent', () => {
  let component: ModelesPageComponent;
  let fixture: ComponentFixture<ModelesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
