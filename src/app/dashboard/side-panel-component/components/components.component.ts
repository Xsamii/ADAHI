import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { DashboardService } from '../../dashboard.service';
import {
  EngineeringDisciplineType,
  engineeringDisciplines,
  SubSubDiscipline,
} from '../../Descpline';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [CardModule, MultiSelectModule, FormsModule],
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss',
})
export class ComponentsComponent {
  components: { name: string; selected: boolean }[] = [];
  selectedComponent!: { name: string; selected: boolean }[];
  subComponents: { name: string; selected: boolean; type: string }[] = [];
  selectedSubComponent: {
    name: string;
    selected: boolean;
    type: string;
  }[] = [];
  subDesciplines!: EngineeringDisciplineType[];
  selectedSubDesciplines!: EngineeringDisciplineType[];
  subSubDesciplines!: SubSubDiscipline[];
  selectedSubSubDesciplines!: SubSubDiscipline[];

  /**
   *
   */
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.components.subscribe((v) => {
      const values = v
        .filter((v) => v.selected)
        .map((component) => component.name);
      this.components = v;
      this.selectedComponent = v.filter((component) => component.selected);
      this.subDesciplines = engineeringDisciplines.filter((discipline) =>
        values.includes(discipline.type)
      );
    });
    this.dashboardService.subComponents.subscribe((v) => {
      this.subComponents = v;
      this.selectedSubComponent = v.filter((component) => component.selected);
    });
    // this.dashboardService.engineeringDescipline.subscribe((v) => {
    //   this.subDesciplines = v.filter((component) => component.selected);
    //   this.selectedSubDesciplines = v.filter((component) => component.selected);
    // });
  }
  onComponentChange(event: any) {
    this.selectedComponent = event.value;
    const values = event.value.map((component: any) => component.name);
    console.log('Component Values', values);
    this.components = this.components.map((component) => {
      if (values.includes(component.name)) {
        component.selected = true;
      } else {
        component.selected = false;
      }
      return component;
    });
    this.dashboardService.components.next(this.components);
    this.subComponents = this.dashboardService.subComponents.value.filter(
      (subComponent) => values.includes(subComponent.type)
    );
    if (this.selectedSubComponent.length > 0) {
      this.selectedSubComponent = this.selectedSubComponent.filter(
        (subComponent) => values.includes(subComponent.type)
      );
    }
    this.subDesciplines = engineeringDisciplines.filter((discipline) =>
      values.includes(discipline.type)
    );
    console.log(
      'new sub desciplines',
      this.subDesciplines,
      engineeringDisciplines
    );
  }
  onSubComponentChange(event: any) {
    this.selectedSubComponent = event.value;
    console.log('event', event.value);
    const valeus = event.value.map((component: any) => component.name);
    this.subComponents = this.subComponents.map((component) => {
      if (valeus.includes(component.name)) {
        component.selected = true;
      } else {
        component.selected = false;
      }
      return component;
    });
    // console.log('rev sub', this.subComponents);
    this.dashboardService.subComponents.next(
      this.dashboardService.subComponents.value.map((prevSubComponent) => {
        let updatedSubComponent;
        if (valeus.includes(prevSubComponent.name)) {
          updatedSubComponent = { ...prevSubComponent, selected: true };
        } else {
          updatedSubComponent = { ...prevSubComponent, selected: false };
        }
        return updatedSubComponent || prevSubComponent;
      })
    );
  }
  onSubDesciplinesChange(event: any) {
    this.selectedSubDesciplines = event.value;

    // Extract all subSubDisciplines from selected subDisciplines
    const allSubSubDisciplines: SubSubDiscipline[] = [];
    this.selectedSubDesciplines.forEach((discipline) => {
      if (discipline.subSubDisciplines?.length) {
        allSubSubDisciplines.push(...discipline.subSubDisciplines);
      }
      // Also check inside systemNames if present
      if (discipline.systemNames) {
        Object.values(discipline.systemNames).forEach((subs) => {
          allSubSubDisciplines.push(...subs);
        });
      }
    });

    // Remove duplicates by name
    const unique = new Map();
    allSubSubDisciplines.forEach((d) => {
      if (!unique.has(d.name)) {
        unique.set(d.name, d);
      }
    });

    // this.subSubDesciplines = Array.from(unique.values());

    // Notify DashboardService
    this.dashboardService.engineeringDescipline.next(
      this.dashboardService.engineeringDescipline.value.map((disc) => {
        return {
          ...disc,
          selected: this.selectedSubDesciplines.some(
            (s) => s.name === disc.name
          ),
        };
      })
    );
    const subSubOptions =
      this.dashboardService.getSubSubDisciplinesFromSelectedSubDisciplines();

    this.subSubDesciplines = subSubOptions.map((name) => ({
      name,
      selected: false,
    }));
  }
  onSubSubDesciplinesChange(event: any) {
    this.selectedSubSubDesciplines = event.value;

    const selectedNames = new Set(
      this.selectedSubSubDesciplines.map((s) => s.name)
    );

    const updatedDisciplines =
      this.dashboardService.engineeringDescipline.value.map((discipline) => {
        const updatedSubSubs = (discipline.subSubDisciplines || []).map(
          (sub) => ({
            ...sub,
            selected: selectedNames.has(sub.name),
          })
        );

        return {
          ...discipline,
          subSubDisciplines: updatedSubSubs,
        };
      });

    this.dashboardService.engineeringDescipline.next(updatedDisciplines);
  }
}
