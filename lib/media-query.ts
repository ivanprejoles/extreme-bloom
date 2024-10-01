import { useState, useEffect } from 'react';

// Custom hook to check if a media query matches
const useMediaQuery = (query: string): boolean => {
  // State to store whether the query matches
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a MediaQueryList object
    const mediaQueryList = window.matchMedia(query);

    // Update the state based on the initial query match status
    setMatches(mediaQueryList.matches);

    // Define a handler to update the state when the query match status changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the event listener
    mediaQueryList.addEventListener('change', handleChange);

    // Cleanup event listener on component unmount
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
