import { supabase } from "@/lib/supabase";

export const fetchAllUsers = async () => {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    return data;
}



export const fetchUserById = async (id: string) => {
    const { data, error } = await supabase.auth.admin.getUserById(id);
    if (error) throw error;

    return data;
};