import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  useEffect(() => {
    // Disable browser's scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Force scroll to top on mount and refresh
    const forceScrollToTop = () => {
      // Multiple approaches to ensure it works
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Execute immediately
    forceScrollToTop();

    // Use a small interval to ensure it works even if DOM is not fully ready
    const intervalId = setInterval(() => {
      if (window.scrollY > 0) {
        forceScrollToTop();
      }
    }, 10);

    // Clear interval after 1 second
    setTimeout(() => {
      clearInterval(intervalId);
    }, 1000);

    // Handle DOMContentLoaded event
    const handleDOMContentLoaded = () => {
      forceScrollToTop();
    };

    // Handle page load event
    const handleLoad = () => {
      forceScrollToTop();
    };

    // Handle beforeunload to reset scroll position
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    // Add event listeners
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    window.addEventListener('load', handleLoad);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
