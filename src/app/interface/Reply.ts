interface Reply {
  reply_id: number;
  user: {
    id: number;
    username: string;
  };
  content: string;
  created_at: string;
  updated_at?: string | null;
}