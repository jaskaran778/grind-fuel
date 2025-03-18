import Scene from "@/components/Scene";
import Text from "@/components/Text";
import Background from "@/components/Background";

export default function Home() {
  return (
    <main className="flex w-full h-screen items-center justify-center">
      <Background />
      <Text />
      <Scene />
    </main>
  );
}
