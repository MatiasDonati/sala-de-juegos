import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usersdata: any[] = [];

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    supabase.from('users-data').select('*').then(({ data, error }) => {
      if (error) {
        console.error('Error:', error.message);
      } else {
        console.log('Datos de usuarios:', data);
        this.usersdata = data;
      }
    });
  }
  

  getAvatarUrl(avatarUrl: string) {
    return supabase.storage.from('images').getPublicUrl(avatarUrl).data.publicUrl;
  }

}
