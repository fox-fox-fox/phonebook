import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private indexDataSource = new BehaviorSubject<number>(0);
  public indexData$ = this.indexDataSource.asObservable();

  private dataSource = new BehaviorSubject<any>({});
  public data$ = this.dataSource.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  getContacts(): Observable<any> {
    return this.http.get("../../assets/data/contacts.json");
  }

  setContacts(contacts: []) {
    localStorage.setItem('Contacts', JSON.stringify(contacts));
  }

  addContact(contact: {}) {
    let contacts = JSON.parse(localStorage.getItem('Contacts')!);
    contacts.push(contact);
    this.setContacts(contacts);
  }

  deleteContact(index: number) {
    let contacts = JSON.parse(localStorage.getItem('Contacts')!);
    contacts.splice(index, 1);
    this.setContacts(contacts);
  }

  setIndexData(index: number) {
    this.indexDataSource.next(index);
  }

  setData(contact: {}) {
    this.dataSource.next(contact);
  }

  editContact(index: number, contact: {}) {
    let contacts = JSON.parse(localStorage.getItem('Contacts')!);
    contacts.splice(index, 1, contact);
    this.setContacts(contacts);
  }

}
