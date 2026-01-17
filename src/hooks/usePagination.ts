// src/hooks/usePagination.ts
import { useState } from "react";

export function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const next = () => setPage((prev) => prev + 1);
  const prev = () => setPage((prev) => Math.max(1, prev - 1));

  return { page, next, prev };
}
