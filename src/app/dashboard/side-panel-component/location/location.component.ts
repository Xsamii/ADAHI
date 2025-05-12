import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { DashboardService } from '../../dashboard.service';
import { DropdownModule } from 'primeng/dropdown';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-location',
  imports: [CardModule, MultiSelectModule, FormsModule, DropdownModule],
  standalone: true,
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent {
  floors: { name: string; checked: boolean }[] = [];
  /**
   *
   */
  constructor(private dashboardService: DashboardService) {}

  selectedFloor!: { name: string; checked: boolean };
  buildings: { name: string; selected: boolean }[] = [];
  selectedBuildings!: { name: string; selected: boolean }[];
  rooms: { name: string; selected: boolean }[] = [];
  selectedRooms!: { name: string; selected: boolean }[];

  ngOnInit() {
    this.dashboardService.floors.subscribe((floors) => {
      // console.log('ffff', this.floors.length);
      if (this.floors.length > 0) {
        return;
      }
      // console.log('floor init');
      this.floors = floors;
      this.selectedFloor = floors.filter((floor) => floor.checked)[0];
      this.buildings = this.dashboardService.buildings.value;
      this.dashboardService.rooms.subscribe((rooms) => {
        console.log('rommm changed', rooms, length);

        // console.log('floor init');
        this.rooms = rooms.map((room) => {
          return {
            name: room,
            selected: false,
          };
        });
      });
    });
  }
  onFloorChange(event: any) {
    // console.log('event', event.value.name);
    this.floors = this.floors.map((floor) => {
      if (floor.name === event.value.name) {
        floor.checked = true;
      } else {
        floor.checked = false;
      }
      return floor;
    });
    this.selectedFloor = event.value;
    this.dashboardService.floors.next(this.floors);
  }
  onBuildingChange(event: any) {
    const valeus = event.value.map((component: any) => component.name);
    this.buildings = this.buildings.map((building) => {
      if (valeus.includes(building.name)) {
        building.selected = true;
      } else {
        building.selected = false;
      }
      return building;
    });
    this.selectedBuildings = event.value;
    console.log('event', this.selectedBuildings);

    this.dashboardService.buildings.next(this.buildings);
  }
  onRoomChange(event: any) {
    console.log('event', event.value);
    this.dashboardService.filterOnRooms(event.value.map((room) => room.name));
  }
}
