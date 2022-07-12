import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgBlockchainXComponent } from './ng-blockchain-x.component';

describe('NgBlockchainXComponent', () => {
  let component: NgBlockchainXComponent;
  let fixture: ComponentFixture<NgBlockchainXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgBlockchainXComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgBlockchainXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
