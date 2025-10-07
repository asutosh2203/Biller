import React from "react";
import Image from "next/image";
import PhoneAuthForm from "./PhoneAuthForm";

type Props = {};

const Loginform = (props: Props) => {
  return (
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
  );
};

export default Loginform;
