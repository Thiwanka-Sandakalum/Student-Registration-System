import { Component, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { DataService } from 'src/app/service/data.service';


@Component({
  selector: 'app-edit-user-popup',
  templateUrl: './edit-user-popup.component.html',
  styleUrls: ['./edit-user-popup.component.css']
})
export class EditUserDialogComponent {
  editForm: FormGroup;
  @Output() dataUpdated = new EventEmitter<User>();

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      id: [data.id, Validators.required],
      firstName: [data.firstName, Validators.required],
      lastName: [data.lastName, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      role: [data.role, Validators.required],
      phoneNumber: [data.phoneNumber, Validators.required],
      gender: [data.gender, Validators.required],
      dateOfBirth: [data.dateOfBirth, Validators.required],
      address: [data.address, Validators.required],
    });
  }


  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedUserData = this.editForm.value as User;
      const userId = updatedUserData.id;

      this.dataService.update(userId, updatedUserData).subscribe(
        (updatedUser: User) => {
          this.dataUpdated.emit(updatedUser);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }


}