import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

    login(email,password) {
        let data ={
            email : email,
            password : password
        }
        return this.http.post(`http://localhost:3000/auth/login`, data);
    }

  register(user: User) {
      return this.http.post(`http://localhost:3000/auth/register`, user);
  }

  delete(id: number) {
      return this.http.delete(`/users/${id}`);
  }
}