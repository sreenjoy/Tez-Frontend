'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ScreenshotWrapperProps {
  imageURL: string;
  fallbackText: string;
  height?: string;
  rounded?: string;
}

export function ScreenshotWrapper({
  imageURL,
  fallbackText,
  height = "100%",
  rounded = "none"
}: ScreenshotWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const roundedClass = rounded === 'lg' ? 'rounded-lg' : rounded === 'xl' ? 'rounded-xl' : '';
  
  // Create an iframe to capture the page content
  return (
    <>
      {hasError ? (
        <div 
          className={`w-full bg-slate-700 flex items-center justify-center ${roundedClass}`}
          style={{ height }}
        >
          <div className="text-white text-lg">{fallbackText}</div>
        </div>
      ) : (
        <iframe 
          src={imageURL}
          className={`w-full h-full border-0 ${roundedClass}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </>
  );
} 