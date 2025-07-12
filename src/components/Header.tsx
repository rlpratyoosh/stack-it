import { SiBetterstack } from "react-icons/si";

export default function Header() {
  return (
    <header className="w-full h-16 bg-card border-border border-b flex items-center justify-between">
      <div className="h-full flex items-center justify-center gap-2 px-6">
        <div className="text-3xl">
          <SiBetterstack />
        </div>
        <h1 className="text-2xl font-bol">
          StackIt
        </h1>
      </div>
    </header>
  );
}