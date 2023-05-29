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

  private store = {
    entries: signal<Entry[]>([]),
    projects: signal<Project[]>([]),
    currentEntry: signal<Partial<EntryComputed>>({}),
  };

  public entries: Signal<EntryComputed[]> = computed(() => this.getComputedEntries());
  public currentEntry = computed(() => this.store.currentEntry());
  public projects = computed(() => this.store.projects());

  constructor() {

    const savedEntries = localStorage.getItem('entries');

    if (savedEntries) {
      this.store.entries.set(JSON.parse(savedEntries))
    }

    const savedProjects = localStorage.getItem('projects');

    if (savedProjects) {
      this.store.projects.set(JSON.parse(savedProjects))
    }

    effect(() => localStorage.setItem('entries', JSON.stringify(this.store.entries())));
    effect(() => localStorage.setItem('projects', JSON.stringify(this.projects())));

    effect(() => console.log('projects', this.projects()));
    effect(() => console.log('entries', this.store.entries()));
    effect(() => console.log('currentEntry', this.currentEntry()));

  }

  private getComputedEntries() {

    const entriesWithProjects = this.store.entries().map(entry => ({
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

    this.store.entries.mutate(entries => entries.push({
      id: crypto.randomUUID(),
      project_id: entryProps.project_id,
      start: entryProps.start,
      stop: entryProps.stop,
      description: entryProps.description,
    }));

  }

  public updateEntry(id: string, props: Partial<Entry>) {

    this.store.entries.mutate(entries => {
      const index = entries.findIndex(entry => entry.id === id);
      entries[index] = { ...entries[index], ...props };
    });

  }

  public deleteEntry(id: string) {

    this.store.entries.update(entries => entries.filter(entry => entry.id != id));

  }

  public updateCurrentEntry(props: Partial<EntryComputed>) {

    this.store.currentEntry.update(entry => ({ ...entry, ...props }));

  }

  public resetCurrentEntry() {

    this.store.currentEntry.set({});

  }

  public addProject(name: string) {

    const colors = ['blue', 'purple', 'red', 'orange', 'green'];

    this.store.projects.mutate(projects => projects.push({
      id: crypto.randomUUID(),
      name,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

  }

  public deleteProject(id: string) {

    this.store.projects.update(projects => projects.filter(project => project.id != id));

  }

}
