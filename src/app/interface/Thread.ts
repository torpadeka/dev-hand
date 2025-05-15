interface Thread {
  thread_id: number | null;
  title: string;
  content: string;
  thread_type: string;
  created_at: string;
  updated_at?: string | null;
  user: {
    id: number | null;
    username: string;
    profile_picture: string;
    is_expert: boolean;
  };
  up_vote: number;
  categories: { id: number | null; name: string | null }[];
  subthreads: Subthread[];
}