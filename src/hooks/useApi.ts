"use client";

import { useQuery, useMutation, type UseQueryOptions } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types";

export function useGet<T>(
  queryKey: unknown[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<T>>(endpoint);
      return data.data;
    },
    ...options,
  });
}

export function usePost<TBody, TResponse>(endpoint: string) {
  return useMutation<TResponse, Error, TBody>({
    mutationFn: async (body) => {
      const { data } = await apiClient.post<ApiResponse<TResponse>>(endpoint, body);
      return data.data;
    },
  });
}

export function usePatch<TBody, TResponse>(endpoint: string) {
  return useMutation<TResponse, Error, TBody>({
    mutationFn: async (body) => {
      const { data } = await apiClient.patch<ApiResponse<TResponse>>(endpoint, body);
      return data.data;
    },
  });
}

export function useDelete<TResponse>(endpoint: string) {
  return useMutation<TResponse, Error, void>({
    mutationFn: async () => {
      const { data } = await apiClient.delete<ApiResponse<TResponse>>(endpoint);
      return data.data;
    },
  });
}
