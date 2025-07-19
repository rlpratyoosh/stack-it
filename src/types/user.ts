export interface UserData {
  id: string;
  clerkId: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  _count: {
    questions: number;
    answers: number;
    comments: number;
    votes: number;
  };
}