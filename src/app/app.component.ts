import { Component, OnInit, effect, signal } from '@angular/core';

interface Entry {
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
  projectInput = '';

  currentEntry = signal<Partial<Entry>>({
    project_id: null,
    start: 0,
    description: '',
  });

  entries = signal<Entry[]>([]);
  projects = signal<Project[]>([]);

  foo(e:any){
    this.currentEntry().description = e;
    // console.log(e);
  }


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

    effect(() => localStorage.setItem('entries', JSON.stringify(this.entries())));
    effect(() => localStorage.setItem('projects', JSON.stringify(this.projects())));

    effect(() => console.log('projects', this.projects(), 'entries', this.entries()));
    effect(() => console.log('currentEntry', this.currentEntry()));

  }

  ngOnInit(): void {

    setInterval(() => {

      if (this.currentEntry().start) {
        this.elapsed = this.getDuration(this.currentEntry().start || 0, this.getNowMs());
      }

    }, 300);

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

    this.startTimer();

  }

  createProject(name: string): void {

    this.projects.mutate(projects => projects.push({
      id: projects.length + 1,
      name,
      color: 'foo',
    }));

  }

  getProjectById(id: number | null | undefined): Project | null {

    return this.projects().find(project => project.id === id) || null;

  }

  updateCurrentEntry(props: Partial<Entry>) {

    this.currentEntry.update(entry => ({ ...entry, ...props }));

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
