    import { useEffect } from 'react';
    import { useLocation } from 'react-router-dom';

    const ScrollToTop = () => {
      const { pathname } = useLocation();

      useEffect(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth' // Optional: for a smooth scrolling animation
        });
      }, [pathname]); // This effect runs whenever the pathname changes (i.e., route changes)

      return null; // This component doesn't render any visible UI
    };

    export default ScrollToTop;