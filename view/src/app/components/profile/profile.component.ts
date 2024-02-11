import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  profileForm: FormGroup;
  isDisabled: boolean = true;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      id: [''],
      firstName: [''],
      email: [''],
      role: [''],
      phoneNumber: [''],
      gender: [''],
      dateOfBirth: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.isEditing = false;
  }

  getUserProfile() {
    const storedUserProfile = localStorage.getItem('user_profile');
    if (storedUserProfile) {
      this.userProfile = JSON.parse(storedUserProfile);
      this.profileForm.patchValue(this.userProfile);
    } else {
      console.error('User profile data not found in local storage.');
    }
  }

  onSubmit() {
  }

  onForgotPassword() {
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue(this.userProfile);
    }
  }
}

