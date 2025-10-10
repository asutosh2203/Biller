// app/page.tsx
"use client";
import Loader from "@/components/Loader";
import PhoneAuthForm from "@/components/PhoneAuthForm";

export default function Home() {

  return (
    <main className="h-[98vh] p-8">
      {/* {checkingAuth ? (
        <Loader loading={checkingAuth} size={50} />
      ) : ( */}
        <div className="h-full flex flex-col sm:flex-row items-center justify-center">
          <img className="flex-[0.5]" src="/assets/home_page_logo.svg" alt="" />
          <PhoneAuthForm 
          // setCheckingAuth={setCheckingAuth} 
          />
        </div>
      {/* )} */}
    </main>
  );
}
