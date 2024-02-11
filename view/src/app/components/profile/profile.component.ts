import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  profileForm: FormGroup;
  isDisabled: boolean = true; // Example value, set it as per your logic

  constructor(private profileService: DataService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      id: [''],
      name: [''],
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
  }

  getUserProfile() {
    // Assuming the service returns an observable
    // this.profileService.getUserProfile().subscribe((profile: any) => {
    //   this.userProfile = profile;
    //   this.profileForm.patchValue(profile); // Patch form with profile data
    // });

    // Dummy profile data
    this.userProfile = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'User',
      phoneNumber: '1234567890',
      gender: 'Male',
      dateOfBirth: '1990-01-01',
      address: '123 Street, City'
      // Add more profile details as needed
    };
    this.profileForm.patchValue(this.userProfile); // Patch form with profile data
  }

  onSubmit() {
    // Handle form submission here
    // Update profile data and save to backend
  }

  onForgotPassword() {
    // Handle forgot password functionality here
  }
}
