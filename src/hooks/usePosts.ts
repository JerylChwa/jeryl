import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Post } from "../lib/types";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data, error: err } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (err) setError(err.message);
      else setPosts(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { posts, loading, error };
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data, error: err } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (err) setError(err.message);
      else setPost(data);
      setLoading(false);
    }
    fetch();
  }, [slug]);

  return { post, loading, error };
}
