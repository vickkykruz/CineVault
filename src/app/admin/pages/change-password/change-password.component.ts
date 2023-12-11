import { Component } from '@angular/core';
import { PasswordSetting } from './passwordSetting';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  checkBoxChecker: boolean = false;
  updatePassword : PasswordSetting = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  handleCheckboxChange(checked: boolean) {
    this.checkBoxChecker = checked;
    // console.log(checked, "SideToggle");
  }

  saveNewPassword(changePasswordForm: NgForm) {

  }
}
