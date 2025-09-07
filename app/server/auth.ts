'use server'

import { supabase } from "@/utils/supabase"

export async function signIn(email: string, password: string) {
    console.log("object: ", email, password)
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    console.log(data, error)
}