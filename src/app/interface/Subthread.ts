interface Subthread {
  subthread_id: number;
  user: {
    id: number;
    username: string | null;
    profile_picture: string;
    is_expert: boolean;
  };
  content: string;
  up_vote: number;
  is_ai_generated: boolean;
  created_at: string;
  updated_at?: string | null;
}