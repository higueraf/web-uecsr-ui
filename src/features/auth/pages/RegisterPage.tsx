import { useNavigate } from "react-router-dom";
import { RegisterUsuarioForm } from "../components/RegisterUsuarioForm";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = async () => {
    navigate("/admin/login");
  };

  return <RegisterUsuarioForm onSubmit={handleRegister} />;
};
