import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Experience } from "../lib/types";

export function useExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data, error: err } = await supabase
        .from("experience")
        .select("*")
        .order("display_order", { ascending: true });

      if (err) setError(err.message);
      else setExperience(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { experience, loading, error };
}
