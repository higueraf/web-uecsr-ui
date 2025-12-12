import { useLoadingStore } from "@/store/loadingStore";

export const LoadingOverlay = () => {
  const loading = useLoadingStore((state) => state.loading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="animate-spin h-14 w-14 border-4 border-white border-t-brand-500 rounded-full"></div>
    </div>
  );
};
