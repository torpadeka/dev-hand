interface Subthread {
  subthread_id: number;
  user: {
    id: number;
    username: string | null;
  };
  content: string;
  up_vote: number;
  is_ai_generated: boolean;
  profile_picture: string;
  created_at: string;
  updated_at?: string | null;
}