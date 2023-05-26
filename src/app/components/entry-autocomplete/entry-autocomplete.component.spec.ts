import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryAutocompleteComponent } from './entry-autocomplete.component';

describe('EntryAutocompleteComponent', () => {
  let component: EntryAutocompleteComponent;
  let fixture: ComponentFixture<EntryAutocompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntryAutocompleteComponent]
    });
    fixture = TestBed.createComponent(EntryAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
