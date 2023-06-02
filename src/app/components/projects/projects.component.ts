import { Component } from '@angular/core';
import { DataService, ProjectColor } from 'src/app/services/data.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  colors: ProjectColor[] = ['blue', 'purple', 'red', 'orange', 'green'];
  defaultColor = this.colors[0];

  constructor(
    public dataService: DataService,
  ) {}

}
