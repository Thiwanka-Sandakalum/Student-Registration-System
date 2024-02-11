import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../user-management/user-management.component';

@Component({
  selector: 'app-add-user-popup',
  templateUrl: './add-user-popup.component.html',
  styleUrls: ['./add-user-popup.component.css']
})
export class AddUserPopupComponent {
  acceptTerms: boolean = false;
  gender!: string;
  @Output() userData = new EventEmitter<User>();
  @ViewChild('userForm') userForm!: NgForm;

  constructor(public dialogRef: MatDialogRef<AddUserPopupComponent>) { }

  submitForm() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      // Send userData to your backend for further processing
      console.log(userData);
      this.userData.emit(userData);
      this.dialogRef.close(userData);
    }
  }

  closePopup() {
    this.dialogRef.close();
  }
}
