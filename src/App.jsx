import "./App.css";
import { useEffect, useRef, useState } from "react";
import throttle from "lodash.throttle";

// Importing assets
import heroImage from "./assets/hero-image.jpg";
import ButtonIcon from "./assets/button-icon.svg";
import AboutTitle from "./assets/about.svg";
import AboutText from "./assets/about-text.svg";
import LineLeft from "./assets/line-left.svg";
import LineRight from "./assets/line-right.svg";
import AboutBg from "./assets/about-bg.jpg";
import Egg from "./assets/egg.png";
import FeaturesTitle from "./assets/features-title.svg";
import Description1 from "./assets/descript-1.svg";
import Card1 from "./assets/card-1.png";
import Card2 from "./assets/card-2.png";
import Card3 from "./assets/card-3.png";
import TextFeat1 from "./assets/text-feat-1.svg";
import TextFeat2 from "./assets/text-feat-2.svg";
import TextFeat3 from "./assets/text-feat-3.svg";
import FeatBg from "./assets/feat-bg.jpg";
import TokenBg from "./assets/token-bg.jpg";
import TokenTitle from "./assets/token-title.svg";
import Arrow from "./assets/arrow.png";
import Dragon from "./assets/dragon.png";

function App() {
  // Refs for sections
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const tokenRef = useRef(null);
  const featuresSpacerRef = useRef(null);
  const featuresCardsRef = useRef(null);

  // Locking variables
  const lockStartScrollY = useRef(0);
  const isLocked = useRef(false);
  const featuresUnlocked = useRef(false);
  const featuresActivationScroll = useRef(0);

  // New state: whether arrow mode is active and which manual card is active
  const [arrowVisible, setArrowVisible] = useState(false);
  // manualIndex: 3 means card 3 is active, then 2 then 1; null means no active card
  const [manualIndex, setManualIndex] = useState(null);

  // Function to handle arrow click
  const handleArrowClick = () => {
    console.log("[Features] Arrow clicked. Current manualIndex:", manualIndex);
    if (manualIndex === 3) {
      // Remove card 3 and display card 2
      featuresRef.current.classList.remove("show-card-3");
      featuresRef.current.classList.add("show-card-2");
      setManualIndex(2);
    } else if (manualIndex === 2) {
      // Remove card 2 and display card 1
      featuresRef.current.classList.remove("show-card-2");
      featuresRef.current.classList.add("show-card-1");
      setManualIndex(1);
    } else if (manualIndex === 1) {
      // Remove card 1 and cycle back to card 3
      featuresRef.current.classList.remove("show-card-1");
      featuresRef.current.classList.add("show-card-3");
      setManualIndex(3);
    }
  };

  // Window height state
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      /*** About Section Animation ***/
      if (aboutRef.current) {
        const aboutRect = aboutRef.current.getBoundingClientRect();
        const aboutStart = windowHeight * 0.8;
        const aboutEnd = windowHeight * 0.2;
        const aboutProgress = Math.max(
          0,
          Math.min(1, (aboutStart - aboutRect.top) / (aboutStart - aboutEnd))
        );
        aboutRef.current.style.setProperty("--scroll", aboutProgress);
      }

      /*** Features Section Animation ***/
      if (featuresRef.current) {
        const featuresRect = featuresRef.current.getBoundingClientRect();
        const featStart = windowHeight * 0.95;
        const featEnd = windowHeight * 0.7;
        const featProgress = Math.max(
          0,
          Math.min(1, (featStart - featuresRect.top) / (featStart - featEnd))
        );
        featuresRef.current.style.setProperty("--feat-scroll", featProgress);
        console.log("[Features] featuresRect.top:", featuresRect.top, 
                    "featProgress:", featProgress, "currentScrollY:", currentScrollY);

        if (!featuresUnlocked.current) {
          if (featuresRect.top <= 0 && !isLocked.current) {
            console.log("[Features] Locking features because featuresRect.top <= 0");
            isLocked.current = true;
            featuresRef.current.classList.add("features-locked");
            lockStartScrollY.current = currentScrollY;
          }

          if (isLocked.current) {
            const extraScroll = currentScrollY - lockStartScrollY.current;
            console.log("[Features] extraScroll:", extraScroll, "isScrollingDown:", isScrollingDown);
            
            if (isScrollingDown) {
              let cardToShow = null;
              if (extraScroll < windowHeight * 0.2) {
                cardToShow = 1;
              } else if (extraScroll < windowHeight * 0.35) {
                cardToShow = 2;
              } else if (extraScroll < windowHeight * 0.5) {
                cardToShow = 3;
              } else {
                console.log("[Features] Extra scroll threshold reached, switching to arrow mode");
                // Instead of waiting for an upscroll cycle, immediately enter arrow mode.
                isLocked.current = false;
                featuresUnlocked.current = true;
                featuresActivationScroll.current = currentScrollY;
                featuresRef.current.classList.remove("features-locked");
                // Enter arrow mode: set the manual active card to 3 and show the arrow.
                setArrowVisible(true);
                setManualIndex(3);
                cardToShow = 3;
              }

              // Clear previous card classes and show the current card
              featuresRef.current.classList.remove("show-card-1", "show-card-2", "show-card-3", "reverse");
              if (cardToShow) {
                featuresRef.current.classList.add(`show-card-${cardToShow}`);
                console.log(`[Features] Showing card ${cardToShow} on downscroll`);
              }
            } else {
              // (Existing upward scroll removal logic can be removed or ignored in arrow mode)
            }
          }
        } else {
          // While scrolling down with unlocked state, ensure the features section remains unlocked.
          if (featuresRef.current.classList.contains("features-locked")) {
            console.log("[Features-Unlocked] Removing features-locked since scrolling down and unlocked state");
            featuresRef.current.classList.remove("features-locked");
            isLocked.current = false;
          }
        }
      }

      /*** Token Section Animation ***/
      if (tokenRef.current) {
        const tokenStart = windowHeight * 1.0;
        const tokenEnd = windowHeight * 0.5;
        const tokenRect = tokenRef.current.getBoundingClientRect();
        const tokenProgress = Math.max(
          0,
          Math.min(1, (tokenStart - tokenRect.top) / (tokenStart - tokenEnd))
        );
        tokenRef.current.style.setProperty("--token-scroll", tokenProgress);
        tokenRef.current.classList.toggle("show-token", tokenProgress > 0.1);
      }

      // Adjust the features spacer height to remove the large gap between the Features and Token sections.
      if (featuresSpacerRef.current) {
        if (featuresUnlocked.current) {
          featuresSpacerRef.current.style.height = "0px";
        } else {
          featuresSpacerRef.current.style.height = windowHeight + "px";
        }
      }
    }, 50);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [windowHeight]);

  return (
    <div className="app-container">
      {/* Hero Section */}
      <div className="hero-section">
        <img src={heroImage} alt="Hero" className="hero-image" />
        <a href="https://x.com/memegotchi_sol" target="_blank" rel="noopener noreferrer" className="cta-button">
          <img src={ButtonIcon} alt="Join Now" className="button-icon" />
        </a>
      </div>

      {/* About Section */}
      <div
        ref={aboutRef}
        className="about-section"
        style={{ backgroundImage: `url(${AboutBg})` }}
      >
        <div className="about-content">
          <img src={AboutTitle} alt="About Title" className="about-title" />
          <img src={AboutText} alt="About Text" className="about-text" />
          <div className="egg-container">
            <img src={Egg} alt="Egg" className="egg-image" />
          </div>
        </div>
        <div className="line-container left">
          <img src={LineLeft} alt="Line Left" className="line-left" />
        </div>
        <div className="line-container right">
          <img src={LineRight} alt="Line Right" className="line-right" />
        </div>
        <div className="ball ball-left"></div>
        <div className="ball ball-right"></div>
      </div>

      {/* Features Section */}
      <div
        ref={featuresRef}
        className="features-section"
        style={{ backgroundImage: `url(${FeatBg})` }}
      >
        <div className="features-header">
          <img
            src={FeaturesTitle}
            alt="Gameplay Features"
            className="features-title"
          />
          <img
            src={Description1}
            alt="Description"
            className="feature-description"
          />
        </div>
        <div ref={featuresCardsRef} className="features-cards">
          {[1, 2, 3].map((index) => (
            <div key={index} className={`feature-card-container card-${index}`}>
              <div className="card-content">
                <img
                  src={index === 1 ? Card1 : index === 2 ? Card2 : Card3}
                  alt={`Feature ${index}`}
                  className="feature-card"
                />
                <img
                  src={index === 1 ? TextFeat1 : index === 2 ? TextFeat2 : TextFeat3}
                  alt={`Feature ${index} description`}
                  className={`feature-text feature-text-${index}`}
                />
                { arrowVisible && manualIndex === index && (
                  <img
                    src={Arrow}
                    alt="Next"
                    className="arrow-pulse"
                    onClick={handleArrowClick}
                    style={{ cursor: "pointer", marginLeft: "-6rem", width: "90px", height: "90px" }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Spacer */}
      <div ref={featuresSpacerRef} className="features-spacer"></div>

      {/* Token Section */}
      <div
        ref={tokenRef}
        className="token-section"
        style={{ backgroundImage: `url(${TokenBg})` }}
      >
        <div className="token-content">
          <div className="token-glow"></div>
          <h2 className="token-heading">Revolutionary Token Ecosystem</h2>
          <div className="token-main-content">
            <div className="token-grid">
              <div className="token-card animated-card">
                <div className="token-pie fair-launch" style={{'--percentage': '100%'}} data-percent="100%&#10;Fair Launch"></div>
                <h3>Supply & Distribution</h3>
                <div className="distribution-info">
                  <p>Total Supply: <span className="info-highlight">1B</span></p>
                  <p>Dev Allocation: <span className="info-highlight">5%</span></p>
                  <p>Contract Address: <span className="info-highlight">Coming soon, refer to Twitter</span></p>
                </div>
              </div>
              
              <div className="dragon-container">
                <img src={Dragon} alt="Dragon" />
              </div>
              
              <div className="token-card animated-card">
                <h3>Token Utility</h3>
                <div className="utility-grid">
                  <div className="utility-item">
                    <div className="utility-icon">🎮</div>
                    <p>In-game Purchases</p>
                  </div>
                  <div className="utility-item">
                    <div className="utility-icon">🏆</div>
                    <p>Tournament Prizes</p>
                  </div>
                  <div className="utility-item">
                    <div className="utility-icon">🌐</div>
                    <p>Governance Votes</p>
                  </div>
                  <div className="utility-item">
                    <div className="utility-icon">🍔</div>
                    <p>Meme Food</p>
                  </div>
                </div>
              </div>
              
              <div className="token-cta">
                <a className="cta-button hover-glow" href="https://x.com/memegotchi_sol" target="_blank" rel="noopener noreferrer">
                  Join the Revolution
                  <span className="cta-arrow">🚀</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="https://x.com/memegotchi_sol" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1DA1F2" width="24" height="24">
              <path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.3 4.3 0 0 0 1.88-2.38 8.166 8.166 0 0 1-2.72 1.04 4.284 4.284 0 0 0-7.3 3.91 12.145 12.145 0 0 1-8.82-4.47 4.285 4.285 0 0 0 1.33 5.72 4.27 4.27 0 0 1-1.94-.54v.06a4.285 4.285 0 0 0 3.43 4.2 4.28 4.28 0 0 1-1.93.07 4.285 4.285 0 0 0 4 2.98A8.588 8.588 0 0 1 2 19.54 12.086 12.086 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68l-.01-.53A8.34 8.34 0 0 0 22.46 6z"/>
            </svg>
            Twitter
          </a>
          <a href="https://t.me/+T1fxEZRBUfQ4Y2Y8" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0088cc" width="24" height="24">
              <path d="M9.34 14.91l-.39 4.06c.55 0 .79-.24 1.09-.53l2.63-2.48 5.45 3.99c1 .55 1.71.26 1.96-.93l3.54-16.32c.29-1.3-.47-1.89-1.3-1.65L2.45 9.19c-1.32.52-1.31 1.24-.23 1.6l5.17 1.61 12.02-7.55c.57-.34 1.09-.15.67.17"/>
            </svg>
            Telegram
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;