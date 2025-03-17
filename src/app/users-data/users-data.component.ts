import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { ApolloError } from '@apollo/client/errors';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { GET_USERS } from '../../query/user';
import { CREATE_USER, DELETE_USER } from '../../mutation/user';
import { CREATE_POST, DELETE_POST } from '../../mutation/post';
import { USER_CREATED } from '../../subscription/user';

@Component({
  selector: 'app-users-data',
  imports: [],
  templateUrl: './users-data.component.html',
  styleUrl: './users-data.component.css'
})
export class UsersDataComponent implements OnInit, OnDestroy {
  name = '';
  email = '';
  newUserName = '';
  textData: Record<number, string> = {};
  isToastVisible = false;

  getUsers: QueryRef<{ getUsers: User[] }>;

  users: User[] = [];
  loading = true;
  error: ApolloError | undefined;

  private querySubscription: Subscription;

  constructor(private readonly apollo: Apollo) {}

  ngOnInit() {
    this.getUsers = this.apollo
      .watchQuery<{ getUsers: User[] }>({
        query: GET_USERS
      });

    this.querySubscription = this.getUsers
      .valueChanges.subscribe(({ data, loading, error }) => {
        this.users = data?.getUsers;
        this.loading = loading;
        this.error = error;
      });

    this.apollo.subscribe<{ userCreated: { name: string }}>({
      query: USER_CREATED,
    }).subscribe(({ data }) => {
      if (!data?.userCreated.name) return;
      this.isToastVisible = true;
      this.newUserName = data?.userCreated.name;
    });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  refetchUsers() {
    this.getUsers.refetch()
  }

  onNameChange(event: Event) {
    this.name = (event.target as HTMLInputElement).value;
  }

  onEmailChange(event: Event) {
    this.email = (event.target as HTMLInputElement).value;
  }

  onTextDataChange(event: Event, id: number) {
    this.textData = {...this.textData, [id]: (event.target as HTMLInputElement).value };
  }

  onIsToastVisibleChange(isToastVisible: boolean) {
    this.isToastVisible = isToastVisible;
  }

  createUser() {
    this.apollo
      .mutate({
        mutation: CREATE_USER,
        variables: {
          createUserInput: {
            name: this.name,
            email: this.email,
          }
        },
      }).subscribe({
        next: () => {
          this.name = '';
          this.email = '';
          this.refetchUsers();
        },
        error: (error) => alert(error.message)
      });
  }

  deleteUser(id: number) {
    this.apollo
      .mutate({
        mutation: DELETE_USER,
        variables: { id },
      }).subscribe({
        next: () => this.refetchUsers(),
        error: (error) => alert(error.message)
      });
  }

  createPost(id: number) {
    this.apollo
      .mutate({
        mutation: CREATE_POST,
        variables: {
          createPostInput: {
            userId: id,
            text: this.textData[id]
          }
        },
      }).subscribe({
        next: () => {
          this.textData = Object.fromEntries(Object.entries(this.textData).filter(([key]) => Number(key) !== id));
          this.refetchUsers();
        },
        error: (error) => alert(error.message)
      });
  }

  deletePost(id: number) {
    this.apollo
      .mutate({
        mutation: DELETE_POST,
        variables: { id },
      }).subscribe({
        next: () => this.refetchUsers(),
        error: (error) => alert(error.message)
      });
  }
}
