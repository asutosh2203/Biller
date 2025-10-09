// app/page.tsx
"use client";
import Loader from "@/components/Loader";
import PhoneAuthForm from "@/components/PhoneAuthForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/userSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClockLoader } from "react-spinners";

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/auth/me", {
          method: "GET",
          credentials: "include", // this sends cookies along with the request
        });

        res.json().then((data) => {
          dispatch(
            setUser({ currentUser: data, isNewUser: !data.isOnboarded })
          );
          data.isOnboarded
            ? router.push("/dashboard")
            : router.push("/onboarding");
        });
      } catch (err) {
        console.log(err);
        // router.push("/");
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <main>
      {checkingAuth ? (
        <Loader loading={checkingAuth} size={50} />
      ) : (
        <div className="flex">
          <Image
            className="flex-[0.5]"
            src="/assets/home_page_logo.svg"
            alt=""
            width={200}
            height={200}
          />
          <PhoneAuthForm />
        </div>
      )}
    </main>
  );
}
