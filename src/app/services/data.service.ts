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

  currentEntry = signal<Partial<EntryComputed>>({
    project: null,
    start: 0,
    description: '',
  });

  entries = signal<Entry[]>([]);
  entriesComputed: Signal<EntryComputed[]> = signal([]);
  entriesReversed: Signal<EntryComputed[]> = signal([]);
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

    this.entriesComputed = computed(() => this.entries().map(entry => ({
      id: entry.id,
      project: this.projects().find(project => project.id === entry.project_id) || null,
      start: entry.start,
      stop: entry.stop,
      description: entry.description,
    })));
    this.entriesReversed = computed(() => [...this.entriesComputed()].reverse());

    effect(() => localStorage.setItem('entries', JSON.stringify(this.entries())));
    effect(() => localStorage.setItem('projects', JSON.stringify(this.projects())));

    effect(() => console.log('projects', this.projects()));
    effect(() => console.log('entries', this.entries()));
    effect(() => console.log('currentEntry', this.currentEntry()));

  }

}
