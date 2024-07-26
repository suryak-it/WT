import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'formproj';
  submitted: boolean = false;
  msg = "";

  frm = new FormGroup({
    firstname: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z_][a-z_]+$/)
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.maxLength(4)
    ]),
    emailid: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    gender: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    isverified: new FormControl(false, Validators.required)
  });

  onSubmit() {
    if (this.frm.valid) {
      this.submitted = true;
      this.msg = 'Form submitted successfully!';
    } else {
      this.msg = 'Please fill in the required fields correctly.';
    }
  }
}