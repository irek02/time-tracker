import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2, Signal, ViewChild, computed, effect, signal } from '@angular/core';
import { Observable, interval, map, of } from 'rxjs';

interface Entry {
  id: number;
  project_id: number | null;
  start: number;
  stop: number;
  description: string;
}

export interface Project {
  id: number;
  name: string;
  color: string;
}

export interface EntryComputed {
  id: number;
  project: Project | null;
  start: number;
  stop: number;
  description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  title = 'time-tracker';

  elapsed = '';

  currentEntry = signal<Partial<EntryComputed>>({
    project: null,
    start: 0,
    description: '',
  });

  entries = signal<Entry[]>([]);
  entriesComputed: Signal<EntryComputed[]> = signal([]);
  entriesReversed: Signal<EntryComputed[]> = signal([]);
  projects = signal<Project[]>([]);
  colors = ['blue', 'purple', 'red', 'orange', 'green'];
  elapsed$: Observable<string>;

  constructor(
  ) {

    const savedEntries = localStorage.getItem('entries');

    if (savedEntries) {
      this.entries.set(JSON.parse(savedEntries))
    }

    const savedProjects = localStorage.getItem('projects');

    if (savedProjects) {
      this.projects.set(JSON.parse(savedProjects))
    }

    this.entriesComputed = computed(() => this.entries().map(entry => ({
      id: entry.id,
      project: this.getProjectById(entry.project_id),
      start: entry.start,
      stop: entry.start,
      description: entry.description,
    })));
    this.entriesReversed = computed(() => [...this.entriesComputed()].reverse());

    this.elapsed$ = interval(100).pipe(
      map(() => {
        if (this.currentEntry().start) {
          return this.getDuration(this.currentEntry().start || 0, this.getNowMs());
        }
        return '';
      }),
    );

    effect(() => localStorage.setItem('entries', JSON.stringify(this.entries())));
    effect(() => localStorage.setItem('projects', JSON.stringify(this.projects())));

    effect(() => console.log('projects', this.projects()));
    effect(() => console.log('entries', this.entries()));
    effect(() => console.log('currentEntry', this.currentEntry()));

  }

  // filteredProjects(term: string, projects: Project[]) {

  //   return projects.filter(project => project.name.includes(term));

  // }

  ngOnInit(): void {

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
      project_id: this.currentEntry().project?.id || null,
      start: this.currentEntry().start || 0,
      stop: this.getNowMs(),
      description: this.currentEntry().description || '',
    }));

    this.currentEntry.set({});

    this.elapsed = '';

  }

  trackAgain(entry: EntryComputed) {

    this.currentEntry.set({
      project: entry.project,
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

  previousEntrySelected(entry: EntryComputed) {

    this.updateCurrentEntry({
      project: entry?.project,
      description: entry.description,
    });
    if (!this.currentEntry().start) {
      this.startTimer();
    }

  }

  getProjectById(id: number | null | undefined): Project | null {

    return this.projects().find(project => project.id === id) || null;

  }

  updateCurrentEntry(props: Partial<EntryComputed>) {

    this.currentEntry.update(entry => ({ ...entry, ...props }));

  }

  updateEntry(id: number, props: Partial<Entry>) {

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
