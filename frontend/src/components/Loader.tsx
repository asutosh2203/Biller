"use client";
import { useState, CSSProperties } from "react";
import { HashLoader} from "react-spinners";
type Props = {
  loading: boolean;
  size: number;
};
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function Loader({ loading, size }: Props) {
  return (
    <div className="sweet-loading h-[100vh] flex flex-col gap-5 items-center justify-center">
      <HashLoader
        loading={loading}
        aria-label="Loading Spinner"
        data-testid="loader"
        size={50}
        color="red"
      />
      <p className="font-semibold">
        Wait, we are trying to get you...
      </p>
    </div>
  );
}

export default Loader;
