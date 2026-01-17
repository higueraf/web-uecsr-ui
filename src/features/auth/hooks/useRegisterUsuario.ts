import { useLoadingStore } from "@/store/loadingStore";
import { registerUsuarioRequest } from "../api/authApi";
import type { RegisterUsuarioPayload } from "../types/RegisterUsuarioPayload";

export const useRegisterUsuario = () => {
  const startLoading = useLoadingStore((s) => s.startLoading);
  const stopLoading = useLoadingStore((s) => s.stopLoading);

  const registerUsuario = async (payload: RegisterUsuarioPayload) => {
    startLoading();
    try {
      await registerUsuarioRequest(payload);
    } finally {
      stopLoading();
    }
  };

  return { registerUsuario };
};
