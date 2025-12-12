import logoUECSR from "@/assets/logo.jpeg";

export const LogoUECSR = () => {
  return (
    <div className="flex items-center gap-4">
      <img
        src={logoUECSR}
        alt="Unidad Educativa Colegio Simón Rodríguez"
        className="w-16 h-16 object-contain"
      />

      <div className="leading-tight">
        <div className="text-sm font-semibold text-white">
          Unidad Educativa Colegio Simón Rodríguez
        </div>
        <div className="text-sm text-blue-100">
          Excelencia Académica
        </div>
      </div>
    </div>
  );
};
