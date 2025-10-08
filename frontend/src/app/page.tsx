// app/page.tsx
"use client";
import Loginform from "@/components/Loginform";
import { useEffect, useState } from "react";

export default function Home() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5001/health")
      .then((res) => res.json())
      .then((data) => setHealth({ status: data }))
      .catch(() => setHealth({ status: "down" }));
  }, []);

  return (
    <main style={{ padding: 32 }}>
      <Loginform />
    </main>
  );
}
