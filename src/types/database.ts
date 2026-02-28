export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string
                    email: string
                    role: "student" | "teacher" | "admin"
                    avatar_url: string | null
                    xp: number
                    streak: number
                    level: number
                    last_active_at: string
                    created_at: string
                }
                Insert: {
                    id: string
                    name: string
                    email: string
                    role?: "student" | "teacher" | "admin"
                    avatar_url?: string | null
                    xp?: number
                    streak?: number
                    level?: number
                    last_active_at?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    role?: "student" | "teacher" | "admin"
                    avatar_url?: string | null
                    xp?: number
                    streak?: number
                    level?: number
                    last_active_at?: string
                    created_at?: string
                }
            }
            experiments: {
                Row: {
                    id: string
                    title: string
                    subject: string
                    description: string | null
                    icon: string | null
                    difficulty: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    subject: string
                    description?: string | null
                    icon?: string | null
                    difficulty?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    subject?: string
                    description?: string | null
                    icon?: string | null
                    difficulty?: string
                    created_at?: string
                }
            }
            user_experiments: {
                Row: {
                    id: string
                    user_id: string
                    experiment_id: string
                    progress: number
                    completed: boolean
                    last_accessed_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    experiment_id: string
                    progress?: number
                    completed?: boolean
                    last_accessed_at?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    experiment_id?: string
                    progress?: number
                    completed?: boolean
                    last_accessed_at?: string
                    created_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    message: string | null
                    read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    message?: string | null
                    read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    message?: string | null
                    read?: boolean
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
