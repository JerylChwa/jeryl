import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Project } from "../lib/types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data, error: err } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("display_order", { ascending: true });

      if (err) setError(err.message);
      else setProjects(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { projects, loading, error };
}
