import { Post } from "./post.interface";

export interface User {
  id: number;
  name: string;
  email: string;
  posts?: Post[];
}
