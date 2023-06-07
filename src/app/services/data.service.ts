import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';

export interface Entry {
  id: string;
  project: {
    id: string;
    name: string;
    color: string;
  } | null;
  start: number;
  stop: number;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface CurrentEntry {
  start?: number;
  description?: string;
  project?: Project;
}

export type ProjectColor = 'blue' | 'purple' | 'red' | 'orange' | 'green';

interface Store {
  entries: WritableSignal<{
    id: string;
    project_id: string | null;
    start: number;
    stop: number;
    description: string;
  }[]>,
  projects: WritableSignal<{
    id: string;
    name: string;
    color: string;
  }[]>,
  currentEntry: WritableSignal<{
    start?: number;
    description?: string;
    project_id?: string;
  }>,
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private store: Store = {
    entries: signal([]),
    projects: signal([]),
    currentEntry: signal({}),
  };

  public currentEntry = computed(() => ({
    ...this.store.currentEntry(),
    project: this.projects().find(project => project.id === this.store.currentEntry().project_id)
  }));
  public entries = computed(() => this.getComputedEntries());
  public projects = computed(() => this.store.projects().sort((a, b) => a.name > b.name ? 1 : -1));

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

    const entriesSortedOlderFirst = entriesWithProjects.sort((a, b) => a.start < b.start ? 1 : -1);

    return entriesSortedOlderFirst;

  }

  public addEntry(props: {
    project_id: string | null,
    start: number,
    stop: number,
    description: string,
  }) {

    this.store.entries.mutate(entries => entries.push({
      id: crypto.randomUUID(),
      project_id: props.project_id,
      start: props.start,
      stop: props.stop,
      description: props.description,
    }));

  }

  public updateEntry(id: string, props: {
    project_id?: string;
    start?: number;
    stop?: number;
    description?: string;
  }) {

    this.store.entries.mutate(entries => {
      const index = entries.findIndex(entry => entry.id === id);
      entries[index] = { ...entries[index], ...props };
    });

  }

  public deleteEntry(id: string) {

    this.store.entries.update(entries => entries.filter(entry => entry.id != id));

  }

  public updateCurrentEntry(props: {
    start?: number;
    stop?: number;
    description?: string;
    project_id?: string;
  }) {

    this.store.currentEntry.update(entry => ({ ...entry, ...props }));

  }

  public resetCurrentEntry() {

    this.store.currentEntry.set({});

  }

  public addProject(name: string, color?: ProjectColor) {

    const colors: ProjectColor[] = ['blue', 'purple', 'red', 'orange', 'green'];

    this.store.projects.mutate(projects => projects.push({
      id: crypto.randomUUID(),
      name,
      color: color || colors[Math.floor(Math.random() * colors.length)],
    }));

  }

  public updateProject(id: string, props: {
    name?: string,
    color?: ProjectColor,
  }) {

    this.store.projects.mutate(projects => {
      const index = projects.findIndex(project => project.id === id);
      projects[index] = { ...projects[index], ...props };
    });

  }

  public deleteProject(id: string) {

    this.store.projects.update(projects => projects.filter(project => project.id != id));

  }

}
