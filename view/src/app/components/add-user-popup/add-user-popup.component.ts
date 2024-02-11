import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/service/data.service';

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

  constructor(public dialogRef: MatDialogRef<AddUserPopupComponent>,
    private dataService: DataService) { }

  submitForm() {
    if (this.userForm.valid) {
      const userData = this.userForm.value as User;
      console.log(userData);

      this.dataService.create(userData).subscribe(
        (createdUser: User) => {
          console.log('User created:', createdUser);
          this.dialogRef.close(createdUser);
        },
        (error) => {
          console.error('Error creating user:', error);
        }
      );
    }
  }

  closePopup() {
    this.dialogRef.close();
  }

  // Custom validator for password strength
  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    return isValid ? null : { 'weakPassword': true };
  }
}
