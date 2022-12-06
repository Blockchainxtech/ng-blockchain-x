import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPopupComponent } from './wallet-popup.component';

describe('WalletPopupComponent', () => {
  let component: WalletPopupComponent;
  let fixture: ComponentFixture<WalletPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
