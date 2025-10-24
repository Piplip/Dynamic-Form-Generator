import { useState, useEffect, useRef } from 'react';

// Define breakpoints (can be customized)
const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export type Breakpoint = keyof typeof breakpoints;

export function useMediaQuery(ref?: React.RefObject<HTMLElement>) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    const calculateBreakpoint = (width: number) => {
      if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint('sm');
      } else {
        setCurrentBreakpoint('xs');
      }
    };

    if (ref && ref.current) {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          calculateBreakpoint(entry.contentRect.width);
        }
      });
      observer.observe(ref.current);
      calculateBreakpoint(ref.current.offsetWidth); // Set initial breakpoint

      return () => observer.disconnect();
    } else {
      const handleResize = () => {
        calculateBreakpoint(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Set initial breakpoint

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [ref]);

  return currentBreakpoint;
}
