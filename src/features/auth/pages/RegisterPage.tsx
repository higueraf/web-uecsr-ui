import { useNavigate } from "react-router-dom";
import { RegisterUsuarioForm } from "../components/RegisterUsuarioForm";
import { useAuth } from "../hooks/useAuth";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <RegisterUsuarioForm
      onSubmit={async (data) => {
        await register(data);
        navigate("/");
      }}
    />
  );
}
