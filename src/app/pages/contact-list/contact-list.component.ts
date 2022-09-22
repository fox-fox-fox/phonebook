import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/components/modal/modal.component';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  contacts: any = {};
  lowValue: number = 0;
  highValue: number = 10;
  sliceData: any = [];

  constructor(
    private apiService: ApiService,
    public matDialog: MatDialog
  ) { }

  ngOnInit() {
    let contactsLS = JSON.parse(localStorage.getItem('Contacts')!);
    if (contactsLS) {
      console.log('Get Contacts from LocalStorage');
      this.contacts = contactsLS;
      this.sliceData = this.contacts.slice(0, 10);
    } else {
      console.log('Get Contacts from API');
      this.apiService.getContacts().subscribe(data => {
        this.contacts = data;
        this.sliceData = this.contacts.slice(0, 10);
        this.apiService.setContacts(this.contacts);
      });
    }

  }

  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    this.sliceData = this.contacts.slice(this.lowValue, this.highValue);
    return event;
  }

  addContact() {
    this.openModal();
  }

  editContact(index: number) {
    this.apiService.setIndexData(this.lowValue + index);
    this.apiService.setData(this.contacts[this.lowValue + index]);
    this.openModal();
  }

  deleteContact(index: number) {
    const _toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3F51B5',
      cancelButtonColor: '#F44336',
      confirmButtonText: '¡Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteContact(index);
        _toast.fire({
          icon: 'success',
          title: 'The contact has been deleted',
        });
        this.contacts = JSON.parse(localStorage.getItem('Contacts')!);
        this.sliceData = this.contacts.slice(0, 10);
        this.paginator.firstPage();
      }
    });

  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '525px';
    dialogConfig.width = '475px';
    const modalDialog = this.matDialog.open(
      ModalComponent,
      dialogConfig
    );
    modalDialog.afterClosed().subscribe((res) => {
      this.contacts = JSON.parse(localStorage.getItem('Contacts')!);
      this.sliceData = this.contacts.slice(0, 10);
      this.paginator.firstPage();
    });
  }

}
