// app/_components/SliderWrapper.jsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import Slider with SSR disabled
const Slider = dynamic(() => import("./Slider"), {
  ssr: false,
});

export default function SliderWrapper(props) {
  return <Slider {...props} />;
}
