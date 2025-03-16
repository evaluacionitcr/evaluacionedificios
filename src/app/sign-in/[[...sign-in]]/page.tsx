import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/OficinaIng.JPG')",
          filter: "brightness(50%)" }}
      ></div>
      <header 
        className="absolute top-0 left-0 w-full p-4 grid grid-cols-3 items-center"
        style={{ background: "#808080" }}>
        <img src="/tec-logo.png" alt="TEC Logo" className="h-10 ml-4" />
        <h1 className="text-white text-lg font-bold text-center">Oficina de Ingeniería</h1>
        <div></div>
      </header>

      <SignIn
        appearance={{
          elements: {
            footer: "hidden",
          },
        }}
      />
      
    </div>
  );
}
