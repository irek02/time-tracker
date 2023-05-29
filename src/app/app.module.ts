import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { EntryAutocompleteComponent } from './components/entry-autocomplete/entry-autocomplete.component';
import { ProjectSelectorComponent } from './components/project-selector/project-selector.component';
import { TrackerComponent } from './components/tracker/tracker.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ProjectsComponent } from './components/projects/projects.component';

@NgModule({
  declarations: [
    AppComponent,
    EntryAutocompleteComponent,
    ProjectSelectorComponent,
    TrackerComponent,
    ReportsComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
