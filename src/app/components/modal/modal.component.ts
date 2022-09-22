import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  formGroup!: FormGroup;
  isEditContact: boolean = false;

  private _toast: typeof Swal = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });;

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalComponent>,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      wallet: ['']
    });

    this.apiService.data$.subscribe((resp) => {
      if (Object.keys(resp).length !== 0) {
        this.isEditContact = true;
        this.formGroup.get('firstName')!.setValue(resp.firstName);
        this.formGroup.get('lastName')!.setValue(resp.lastName);
        this.formGroup.get('email')!.setValue(resp.email);
        this.formGroup.get('telephone')!.setValue(resp.telephone);
        this.formGroup.get('wallet')!.setValue(resp.wallet);
      }
    });

  }

  addContact() {
    this.apiService.addContact(this.formGroup.value);
    this._toast.fire({
      icon: 'success',
      title: 'The contact has been added',
    });
    this.clearForm();
  }

  editContact() {
    this.apiService.indexData$.subscribe((index) => {
      this.apiService.editContact(index, this.formGroup.value);
    });
    this._toast.fire({
      icon: 'success',
      title: 'The contact has been edited',
    });
    this.clearForm();
  }

  clearForm() {
    this.dialogRef.close();
    this.formGroup.reset();
    this.apiService.setData({});
    this.isEditContact = false;
  }

}
