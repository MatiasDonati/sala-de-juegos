import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MelodiaOlvidadizaComponent } from './melodia-olvidadiza.component';

describe('MelodiaOlvidadizaComponent', () => {
  let component: MelodiaOlvidadizaComponent;
  let fixture: ComponentFixture<MelodiaOlvidadizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MelodiaOlvidadizaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MelodiaOlvidadizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
