interface User{
    user_id: number;
    username: string;
    email: string;
    password: string | null;
    is_expert: boolean;
    created_at: Date;
    updated_at: Date;
}