// src/hooks/useAxios.ts
import { useState, useEffect } from "react";
import { apiClient } from "@/services/apiClient";

export function useAxios<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(url)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading };
}
