import { Component, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../user-management/user-management.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-edit-user-popup',
  templateUrl: './edit-user-popup.component.html',
  styleUrls: ['./edit-user-popup.component.css']
})
export class EditUserDialogComponent {
  editForm: FormGroup;
  @Output() dataUpdated = new EventEmitter<User>();

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      id: [{ value: data.id, disabled: true }, Validators.required],
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
      const updatedUserData = this.editForm.value;

      // Emit event containing the updated user data
      this.dataUpdated.emit(updatedUserData);

      // Close the dialog
      this.dialogRef.close();
    }
  }


}