import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Users } from 'src/app/users/users/users';
import { GET_Search, GET_USERS } from 'src/app/users/users/gql/users-query';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Users | undefined;

  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const loggedInUserEmail = sessionStorage.getItem('userEmail');

    this.apollo
      .watchQuery<{ allUsers: Users[] }>({
        query: GET_Search,
        variables: { userFilter: { email: loggedInUserEmail } },
      })
      .valueChanges.subscribe(({ data }) => {
        this.user = data.allUsers[0];
      });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteProfileComponent, {
      width: '400px',
      height:'130px',
      data: { user: this.user },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.router.navigateByUrl('/login');
      }
    });
  }

  openUpdateDialog(): void {
    const dialogRef = this.dialog.open(UpdateProfileComponent, {
      width: '400px',
      // height: '400px',
      data: { user: { ...this.user } },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.loadUserData();
      }
    });
  }

  openResetDialog(): void {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '300px',
      height: '400px',
      data: { user: this.user },
      panelClass: 'custom-dialog-container'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'updated'){

        this.loadUserData();
      }
    });
  }
  
}
