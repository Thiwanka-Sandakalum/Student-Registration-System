import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-popup/edit-user-popup.component';
import { AddUserPopupComponent } from '../add-user-popup/add-user-popup.component';
import { DataService } from 'src/app/service/data.service';
import { User } from 'src/app/models/user';



@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements AfterViewInit {
  constructor(public dialog: MatDialog, private userService: DataService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getAll().subscribe(
      (userData: User[]) => {
        this.dataSource.data = userData;
      },
      (error) => {
        console.error('Error loading user data:', error);
      }
    );
  }


  edit(user: User) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.componentInstance.dataUpdated.subscribe((updatedUserData: User) => {
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
      this.dataSource.data.push(userData);
      this.dataSource._updateChangeSubscription();
    });
  }


  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'phoneNumber', 'gender', 'dateOfBirth', 'address', 'actions'];
  dataSource = new MatTableDataSource<User>(USERS_DATA);

  showEditForm: boolean = false;
  selectedUser: User | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('editForm') editForm!: ElementRef;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  remove(user: User) {
    console.log('Removing user:', user);
    const userId = user.id;
    this.userService.delete(userId).subscribe(
      () => {
        console.log('User deleted:', user);
        const index = this.dataSource.data.indexOf(user);
        if (index > -1) {
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        }
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }


  updateDataSource(updatedUserData: User) {
    const index = this.dataSource.data.findIndex(user => user.id === updatedUserData.id);
    if (index !== -1) {
      this.dataSource.data[index] = updatedUserData;
      this.dataSource._updateChangeSubscription();
    }
  }

}


const USERS_DATA: User[] = [];

