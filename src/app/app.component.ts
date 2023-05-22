import { Component, ElementRef, OnInit, Renderer2, Signal, ViewChild, computed, effect, signal } from '@angular/core';

interface Entry {
  id: number;
  project_id: number | null;
  start: number;
  stop: number;
  description: string;
}

interface Project {
  id: number;
  name: string;
  color: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'time-tracker';

  elapsed = '';
  dropdownOpen = false;

  currentEntry = signal<Partial<Entry>>({
    project_id: null,
    start: 0,
    description: '',
  });

  entries = signal<Entry[]>([]);
  entriesReversed;
  projects = signal<Project[]>([]);
  colors = ['blue', 'purple', 'red', 'orange', 'green'];

  @ViewChild('autocompleteContainer') autocompleteContainer: ElementRef | null = null;

  constructor(
    private renderer: Renderer2,
  ) {

    const savedEntries = localStorage.getItem('entries');

    if (savedEntries) {
      this.entries.set(JSON.parse(savedEntries))
    }

    const savedProjects = localStorage.getItem('projects');

    if (savedProjects) {
      this.projects.set(JSON.parse(savedProjects))
    }

    this.entriesReversed = computed(() => [...this.entries()].reverse());

    effect(() => localStorage.setItem('entries', JSON.stringify(this.entries())));
    effect(() => localStorage.setItem('projects', JSON.stringify(this.projects())));

    effect(() => console.log('projects', this.projects()));
    effect(() => console.log('entries', this.entries()));
    effect(() => console.log('currentEntry', this.currentEntry()));

  }

  filteredEntries(term: string, entries: Entry[]) {

    return entries
      .filter(entry => !!entry.description || !!entry.project_id)
      .filter(entry => entry.description?.toLowerCase().includes(term) ||
      this.getProjectById(entry.project_id)?.name.toLocaleLowerCase().includes(term));

  }

  filteredProjects(term: string, projects: Project[]) {

    return projects.filter(project => project.name.includes(term));

  }

  ngOnInit(): void {

    this.renderer.listen('window', 'click', (e:Event) => {
      if (!this.autocompleteContainer?.nativeElement.contains(e.target)){
        this.dropdownOpen = false;
      }
    });

    setInterval(() => {

      if (this.currentEntry().start) {
        this.elapsed = this.getDuration(this.currentEntry().start || 0, this.getNowMs());
      }

    }, 300);

  }

  filterProjectByName(project: Project, term: string) {

    return project.name.includes(term);

  }

  getNowMs(): number {

    return Date.now();

  }

  getTimeString(dateMs: number): string {

    return new Date(dateMs).toLocaleTimeString();

  }

  startTimer(): void {

    this.currentEntry.mutate(entry => entry.start = Date.now());

  }

  stopTimer(): void {

    this.entries.mutate(entries => entries.push({
      id: this.entries().length + 1,
      project_id: this.currentEntry().project_id || null,
      start: this.currentEntry().start || 0,
      stop: this.getNowMs(),
      description: this.currentEntry().description || '',
    }));

    this.currentEntry.set({});

    this.elapsed = '';

  }

  trackAgain(entry: Entry) {

    this.currentEntry.set({
      project_id: entry.project_id,
      description: entry.description,
    });

    if (!this.currentEntry().start) {
      this.startTimer();
    }

  }

  createProject(name: string): void {

    this.projects.mutate(projects => projects.push({
      id: projects.length + 1,
      name,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
    }));

  }

  previousEntrySelected(entry: Entry, el: any) {

    this.updateCurrentEntry({
      project_id: entry.project_id,
      description: entry.description,
    });
    if (!this.currentEntry().start) {
      this.startTimer();
    }
    this.dropdownOpen = false;
    el.focus();

  }

  getProjectById(id: number | null | undefined): Project | null {

    return this.projects().find(project => project.id === id) || null;

  }

  updateCurrentEntry(props: Partial<Entry>) {

    this.currentEntry.update(entry => ({ ...entry, ...props }));

  }

  updateEntry(id: number, props: Partial<Entry>) {

    console.log(id, props);

    this.entries.mutate(entries => {
      const index = entries.findIndex(entry => entry.id === id);
      entries[index] = { ...entries[index], ...props };
    });

  }

  foo() {
    console.log('he');
  }

  getDuration(startMs: number, stopMs: number): string {

    const asSec = Math.abs((stopMs - startMs) / 1000);

    let hour = Math.floor(asSec / 60 / 60);
    let min = Math.floor(asSec / 60 - hour * 60);
    let sec = Math.floor(asSec - min * 60 - hour * 60 * 60);

    const hourStr = hour > 9 ? hour : '0' + hour;
    const minStr = min > 9 ? min : '0' + min;
    const secStr = sec > 9 ? sec : '0' + sec;

    return `${hourStr}:${minStr}:${secStr}`;

  }

}
