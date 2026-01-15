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
                    email: string
                    role: 'exporter' | 'importer' | 'admin'
                    status: 'pending' | 'active' | 'suspended'
                    onboarding_completed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    role?: 'exporter' | 'importer' | 'admin'
                    status?: 'pending' | 'active' | 'suspended'
                    onboarding_completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: 'exporter' | 'importer' | 'admin'
                    status?: 'pending' | 'active' | 'suspended'
                    onboarding_completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            exporter_profiles: {
                Row: {
                    id: string
                    user_id: string
                    company_name: string
                    country: string
                    city: string
                    products: string[]
                    moq: number
                    moq_unit: string
                    certifications: string[] | null
                    product_images: string[] | null
                    description: string | null
                    phone: string | null
                    website: string | null
                    verified: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    company_name: string
                    country: string
                    city: string
                    products: string[]
                    moq: number
                    moq_unit?: string
                    certifications?: string[] | null
                    product_images?: string[] | null
                    description?: string | null
                    phone?: string | null
                    website?: string | null
                    verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    company_name?: string
                    country?: string
                    city?: string
                    products?: string[]
                    moq?: number
                    moq_unit?: string
                    certifications?: string[] | null
                    product_images?: string[] | null
                    description?: string | null
                    phone?: string | null
                    website?: string | null
                    verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            importer_profiles: {
                Row: {
                    id: string
                    user_id: string
                    company_name: string
                    country: string
                    city: string
                    interested_categories: string[] | null
                    phone: string | null
                    website: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    company_name: string
                    country: string
                    city: string
                    interested_categories?: string[] | null
                    phone?: string | null
                    website?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    company_name?: string
                    country?: string
                    city?: string
                    interested_categories?: string[] | null
                    phone?: string | null
                    website?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    icon: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    icon?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    icon?: string | null
                    created_at?: string
                }
            }
            blogs: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    excerpt: string | null
                    content: string
                    author_id: string | null
                    cover_image: string | null
                    category: string | null
                    published: boolean
                    published_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    excerpt?: string | null
                    content: string
                    author_id?: string | null
                    cover_image?: string | null
                    category?: string | null
                    published?: boolean
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    excerpt?: string | null
                    content?: string
                    author_id?: string | null
                    cover_image?: string | null
                    category?: string | null
                    published?: boolean
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    exporter_id: string
                    category_id: string
                    title: string
                    description: string
                    price: number
                    currency: string
                    moq: number
                    moq_unit: string
                    images: string[]
                    certifications: string[]
                    location: string
                    status: 'active' | 'inactive' | 'draft'
                    views: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    exporter_id: string
                    category_id: string
                    title: string
                    description: string
                    price: number
                    currency?: string
                    moq: number
                    moq_unit: string
                    images?: string[]
                    certifications?: string[]
                    location: string
                    status?: 'active' | 'inactive' | 'draft'
                    views?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    exporter_id?: string
                    category_id?: string
                    title?: string
                    description?: string
                    price?: number
                    currency?: string
                    moq?: number
                    moq_unit?: string
                    images?: string[]
                    certifications?: string[]
                    location?: string
                    status?: 'active' | 'inactive' | 'draft'
                    views?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            inquiries: {
                Row: {
                    id: string
                    product_id: string
                    importer_id: string
                    exporter_id: string
                    message: string
                    quantity: number
                    status: 'new' | 'in_progress' | 'closed'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    importer_id: string
                    exporter_id: string
                    message: string
                    quantity: number
                    status?: 'new' | 'in_progress' | 'closed'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    importer_id?: string
                    exporter_id?: string
                    message?: string
                    quantity?: number
                    status?: 'new' | 'in_progress' | 'closed'
                    created_at?: string
                    updated_at?: string
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
            user_role: 'exporter' | 'importer' | 'admin'
            profile_status: 'pending' | 'active' | 'suspended'
        }
    }
}
