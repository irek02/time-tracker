import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Entry, Project } from 'src/app/services/data.service';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent {

  @Input() entry: Partial<Entry> | null = null;
  @Input() projects: Project[] = [];

  @Output() projectSelected = new EventEmitter<string>();
  @Output() projectCreated = new EventEmitter<string>();

  filteredProjects(term: string, projects: Project[]) {

    return projects.filter(project => project.name.includes(term));

  }

}
