import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Profile } from "../lib/types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data, error: err } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (err) setError(err.message);
      else setProfile(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return { profile, loading, error };
}
