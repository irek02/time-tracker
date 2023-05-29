import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, signal } from '@angular/core';
import { Entry } from 'src/app/services/data.service';

@Component({
  selector: 'app-entry-autocomplete',
  templateUrl: './entry-autocomplete.component.html',
  styleUrls: ['./entry-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryAutocompleteComponent {

  @Input() currentEntry: Partial<Entry> = {};
  @Input() entries: Entry[] = [];

  @Output() inputKeyup = new EventEmitter<string>();
  @Output() entrySelected = new EventEmitter<Entry>();

  @ViewChild('autocompleteContainer') autocompleteContainer: ElementRef | null = null;

  dropdownOpen = signal(false);

  constructor(
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {

    this.renderer.listen('window', 'click', (e:Event) => {
      if (!this.autocompleteContainer?.nativeElement.contains(e.target)){
        this.dropdownOpen.set(false);
      }
    });

  }

  filteredEntries(term: string, entries: Entry[]) {

    const entriesHash: { [key: string]: Entry } = {};

    entries.forEach(entry => {
      entriesHash[entry.description + entry.project?.name] = entry;
    });

    return Object.values(entriesHash)
      .filter(entry => !!entry.description || !!entry.project)
      .filter(entry => entry.description?.toLowerCase().includes(term.toLowerCase()) ||
        entry.project?.name.toLowerCase().includes(term.toLowerCase()));

  }

}
