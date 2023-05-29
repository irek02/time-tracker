import { Injectable, Signal, computed, effect, signal } from '@angular/core';

export interface Entry {
  id: string;
  project_id: string | null;
  start: number;
  stop: number;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface EntryComputed {
  id: string;
  project: Project | null;
  start: number;
  stop: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _currentEntry = signal<Partial<EntryComputed>>({
    project: null,
    start: 0,
    description: '',
  });
  private entries = signal<Entry[]>([]);

  public entriesComputed: Signal<EntryComputed[]> = computed(() => this.getComputedEntries());
  public currentEntry = computed(() => this._currentEntry());

  projects = signal<Project[]>([]);

  constructor() {

    const savedEntries = localStorage.getItem('entries');

    if (savedEntries) {
      this.entries.set(JSON.parse(savedEntries))
    }

    const savedProjects = localStorage.getItem('projects');

    if (savedProjects) {
      this.projects.set(JSON.parse(savedProjects))
    }

    effect(() => localStorage.setItem('entries', JSON.stringify(this.entries())));
    effect(() => localStorage.setItem('projects', JSON.stringify(this.projects())));

    effect(() => console.log('projects', this.projects()));
    effect(() => console.log('entries', this.entries()));
    effect(() => console.log('currentEntry', this.currentEntry()));

  }

  private getComputedEntries() {
    const entriesWithProjects = this.entries().map(entry => ({
      id: entry.id,
      project: this.projects().find(project => project.id === entry.project_id) || null,
      start: entry.start,
      stop: entry.stop,
      description: entry.description,
    }));

    const entriesSortedOlderFirst = [...entriesWithProjects].reverse();

    return entriesSortedOlderFirst;
  }

  public addEntry(entryProps: {
    project_id: string | null,
    start: number,
    stop: number,
    description: string,
  }) {

    this.entries.mutate(entries => entries.push({
      id: crypto.randomUUID(),
      project_id: entryProps.project_id,
      start: entryProps.start,
      stop: entryProps.stop,
      description: entryProps.description,
    }));

  }

  public updateEntry(id: string, props: Partial<Entry>) {

    this.entries.mutate(entries => {
      const index = entries.findIndex(entry => entry.id === id);
      entries[index] = { ...entries[index], ...props };
    });

  }

  public deleteEntry(id: string) {

    this.entries.update(entries => entries.filter(entry => entry.id != id));

  }

  public updateCurrentEntry(props: Partial<EntryComputed>) {

    this._currentEntry.mutate(entry => ({ ...entry, ...props }));

  }

  public resetCurrentEntry() {

    this._currentEntry.set({});

  }

}
