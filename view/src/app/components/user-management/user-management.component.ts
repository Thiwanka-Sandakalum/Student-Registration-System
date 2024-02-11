import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-popup/edit-user-popup.component';
import { AddUserPopupComponent } from '../add-user-popup/add-user-popup.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements AfterViewInit {
  constructor(public dialog: MatDialog) { }


  edit(user: User) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.componentInstance.dataUpdated.subscribe((updatedUserData: User) => {
      // Update the data source for the table with the updated user data
      // Assuming you have a method to update the data source named updateDataSource()
      this.updateDataSource(updatedUserData);
      console.log("updatedUserData", updatedUserData)
    });
  }

  addData() {
    const dialogRef = this.dialog.open(AddUserPopupComponent, {
      width: '500px',
    });

    dialogRef.componentInstance.userData.subscribe((userData: any) => {
      console.log('Received User Data:', userData);
      // Update your table data source here
      this.dataSource.data.push(userData);
      this.dataSource._updateChangeSubscription(); // Update data source
    });
  }


  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'phoneNumber', 'gender', 'dateOfBirth', 'address', 'actions'];
  dataSource = new MatTableDataSource<User>(USERS_DATA);

  showEditForm: boolean = false;
  selectedUser: User = {}; // Initializing with an empty object

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('editForm') editForm!: ElementRef;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  remove(user: User) {
    console.log('Removing user:', user);
    const index = this.dataSource.data.indexOf(user);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    }
  }

  updateDataSource(updatedUserData: User) {
    const index = this.dataSource.data.findIndex(user => user.id === updatedUserData.id);
    if (index !== -1) {
      this.dataSource.data[index] = updatedUserData;
      this.dataSource._updateChangeSubscription();
    }
  }

  // edit(user: User) {
  //   console.log('Editing user:', user);
  //   this.selectedUser = { ...user }; // Copy user data
  //   this.showEditForm = true;
  // }

  save() {
    console.log('Saving edited user:', this.selectedUser);
    // Perform save operation here
    this.showEditForm = false;
  }
}

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
}

const USERS_DATA: User[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Admin', phoneNumber: '1234567890', gender: 'Male', dateOfBirth: '1990-01-01', address: '123 Main St' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'User', phoneNumber: '9876543210', gender: 'Female', dateOfBirth: '1995-05-05', address: '456 Elm St' },

  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Admin', phoneNumber: '1234567890', gender: 'Male', dateOfBirth: '1990-01-01', address: '123 Main St' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'User', phoneNumber: '9876543210', gender: 'Female', dateOfBirth: '1995-05-05', address: '456 Elm St' },

  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Admin', phoneNumber: '1234567890', gender: 'Male', dateOfBirth: '1990-01-01', address: '123 Main St' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'User', phoneNumber: '9876543210', gender: 'Female', dateOfBirth: '1995-05-05', address: '456 Elm St' },

  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Admin', phoneNumber: '1234567890', gender: 'Male', dateOfBirth: '1990-01-01', address: '123 Main St' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'User', phoneNumber: '9876543210', gender: 'Female', dateOfBirth: '1995-05-05', address: '456 Elm St' },

  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Admin', phoneNumber: '1234567890', gender: 'Male', dateOfBirth: '1990-01-01', address: '123 Main St' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'User', phoneNumber: '9876543210', gender: 'Female', dateOfBirth: '1995-05-05', address: '456 Elm St' },
];
