import React, { useEffect } from 'react';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  useEffect(() => {
    let lastScrollTop = 0;
    const footer = document.querySelector(".footer");

    const handleScroll = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Scroll down - hide the footer
        footer.style.transform = "translateY(100%)";
      } else {
        // Scroll up - show the footer
        footer.style.transform = "translateY(0)";
      }

      lastScrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="footer">
      <p>Recipe Haven © 2024</p>
      <p><a href="/support">Support</a></p>
    </footer>
  );
}

export default Footer;
