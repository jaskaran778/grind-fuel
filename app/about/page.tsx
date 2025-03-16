import Navbar from "@/components/navbar";

export default function About() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">About</h1>
      </div>
    </div>
  );
}
