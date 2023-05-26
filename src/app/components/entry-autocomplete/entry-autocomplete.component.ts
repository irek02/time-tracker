import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, signal } from '@angular/core';
import { EntryComputed } from 'src/app/app.component';

@Component({
  selector: 'app-entry-autocomplete',
  templateUrl: './entry-autocomplete.component.html',
  styleUrls: ['./entry-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryAutocompleteComponent {

  @Input() currentEntry: Partial<EntryComputed> = {};
  @Input() entries: EntryComputed[] = [];

  @Output() inputKeyup = new EventEmitter<string>();
  @Output() entrySelected = new EventEmitter<EntryComputed>();

  @ViewChild('autocompleteContainer') autocompleteContainer: ElementRef | null = null;

  dropdownOpen = signal(false);

  constructor(
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {

    this.renderer.listen('window', 'click', (e:Event) => {
      console.log(this.autocompleteContainer?.nativeElement.contains(e.target));
      if (!this.autocompleteContainer?.nativeElement.contains(e.target)){
        this.dropdownOpen.set(false);
      }
    });

  }

  filteredEntries(term: string, entries: EntryComputed[]) {

    console.log('filtered');

    return entries
      .filter(entry => !!entry.description || !!entry.project)
      // .filter(entry => {
      //   console.log('term', term);
      //   console.log('desc', entry.description);
      //   console.log('proj', this.getProjectById(entry.project_id)?.name);
      //   return entry.description?.toLowerCase().includes(term.toLowerCase()) ||
      //     this.getProjectById(entry.project_id)?.name.toLowerCase().includes(term.toLowerCase())
      // });
      .filter(entry => entry.description?.toLowerCase().includes(term.toLowerCase()) ||
      entry.project?.name.toLowerCase().includes(term.toLowerCase()));

  }

}
