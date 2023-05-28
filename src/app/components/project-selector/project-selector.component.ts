import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntryComputed, Project } from 'src/app/app.component';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent {

  @Input() entry: Partial<EntryComputed> | null = null;
  @Input() projects: Project[] = [];

  @Output() projectSelected = new EventEmitter<Project>();
  @Output() projectCreated = new EventEmitter<string>();
  @Output() projectDeleted = new EventEmitter<string>();

  filteredProjects(term: string, projects: Project[]) {

    return projects.filter(project => project.name.includes(term));

  }

}
