'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SliderDesktop with SSR disabled
const SliderDesktop = dynamic(() => import('./SliderDestop'), {
  ssr: false,
});

const SliderDesktopWrapper = ({ SliderDesktopList }) => {
  return <SliderDesktop SliderDesktopList={SliderDesktopList} />;
};

export default SliderDesktopWrapper;
