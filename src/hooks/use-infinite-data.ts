import { useState, useEffect, useCallback, useRef } from "react";

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  size: number;
  page: number;
  totalPages: number;
}

interface UseInfiniteDataOptions<T, P> {
  fetchFn: (params: P & { page: number; size: number }) => Promise<PaginatedResponse<T>>;
  params: P;
  pageSize?: number;
  enabled?: boolean;
}

interface UseInfiniteDataReturn<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  total: number;
  refresh: () => Promise<void>;
  loadMore: () => void;
}

/**
 * useInfiniteData Hook
 *
 * A truly generic infinite scroll pagination hook.
 * Handle states for loading, errors, and pagination for any data type.
 */
export function useInfiniteData<T, P extends object>(
  options: UseInfiniteDataOptions<T, P>
): UseInfiniteDataReturn<T> {
  const { fetchFn, params, pageSize = 25, enabled = true } = options;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const paramsRef = useRef(params);
  const hasStartedRef = useRef(false);
  const lastFetchedParamsRef = useRef<string>("");

  const hasMore = page < totalPages;

  const fetchData = useCallback(
    async (pageNum: number, isInitial: boolean) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const response = await fetchFn({
          ...paramsRef.current,
          page: pageNum,
          size: pageSize,
        });

        if (response.success) {
          setData((prev) => (isInitial ? response.data : [...prev, ...response.data]));
          setTotal(response.total);
          setTotalPages(response.totalPages);
          setPage(pageNum);
          if (isInitial) hasStartedRef.current = true;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load data";
        setError(message);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [fetchFn, pageSize]
  );

  const stringifiedParams = JSON.stringify(params);

  useEffect(() => {
    paramsRef.current = params;
    const paramsChanged = lastFetchedParamsRef.current !== stringifiedParams;

    // 1. Handle Reset on Params Change
    if (paramsChanged && lastFetchedParamsRef.current !== "") {
      setData([]);
      setPage(1);
      setTotal(0);
      setTotalPages(1);
      hasStartedRef.current = false;
      isFetchingRef.current = false;
    }

    // 2. Initial Fetch
    if (enabled && (paramsChanged || !hasStartedRef.current)) {
      lastFetchedParamsRef.current = stringifiedParams;
      fetchData(1, true);
    }
  }, [stringifiedParams, enabled, fetchData, params]);

  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingRef.current || !enabled) return;
    fetchData(page + 1, false);
  }, [hasMore, page, enabled, fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(1, true);
  }, [fetchData]);

  return {
    data,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    total,
    refresh,
    loadMore,
  };
}
