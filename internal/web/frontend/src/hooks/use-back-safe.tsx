import { useCallback } from "react";
import { useNavigate } from "react-router";

export default function useSafeBack(fallbackUrl: string | null = null) {
  const navigate = useNavigate();
  const url = fallbackUrl ?? "/";

  return useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(url);
    }
  }, [navigate, url]);
}