import { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const idleMusicRef = useRef<HTMLAudioElement>(null);
  const bloomMusicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Start playing idle music when component mounts
    if (idleMusicRef.current) {
      idleMusicRef.current.volume = 0.3;
      idleMusicRef.current.play().catch(err => console.log('Autoplay prevented:', err));
    }
  }, []);

  const handleClick = () => {
    if (!started) {
      setStarted(true);

      // Fade out and stop idle music
      if (idleMusicRef.current) {
        const fadeOut = setInterval(() => {
          if (idleMusicRef.current && idleMusicRef.current.volume > 0.05) {
            idleMusicRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
            if (idleMusicRef.current) {
              idleMusicRef.current.pause();
              idleMusicRef.current.currentTime = 0;
            }
          }
        }, 100);
      }

      // Start bloom music
      if (bloomMusicRef.current) {
        bloomMusicRef.current.volume = 0;
        bloomMusicRef.current.play();

        // Fade in bloom music
        const fadeIn = setInterval(() => {
          if (bloomMusicRef.current && bloomMusicRef.current.volume < 0.5) {
            bloomMusicRef.current.volume += 0.05;
          } else {
            clearInterval(fadeIn);
          }
        }, 100);
      }

      setTimeout(() => {
        setShowMessage(true);
      }, 6000);
    }
  };

  const stars = useMemo(() => {
    return [...Array(60)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
      opacity: Math.random()
    }));
  }, []);

  return (
    <div className={`app ${!started ? 'not-loaded' : ''}`} onClick={handleClick}>
      {/* Audio elements */}
      <audio ref={idleMusicRef} loop>
        <source src="/audio/idle.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={bloomMusicRef} loop>
        <source src="/audio/bloom.mp3" type="audio/mpeg" />
      </audio>

      <div className="night"></div>
      <div className="stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
              opacity: star.opacity
            }}
          ></div>
        ))}
      </div>
      <div className="bottom-gradient"></div>
      {started && <div className="garden-glow"></div>}
      <div className="flowers">
        {/* Main Rose Flowers */}
        <div className="flower flower--1">
          <div className="flower__leafs flower__leafs--1">
            <div className="flower__leaf flower__leaf--1"></div>
            <div className="flower__leaf flower__leaf--2"></div>
            <div className="flower__leaf flower__leaf--3"></div>
            <div className="flower__leaf flower__leaf--4"></div>
            <div className="flower__white-circle"></div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flower__light flower__light--${i + 1}`}></div>
            ))}
          </div>
          <div className="flower__line">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`}></div>
            ))}
          </div>
        </div>

        <div className="flower flower--2">
          <div className="flower__leafs flower__leafs--2">
            <div className="flower__leaf flower__leaf--1"></div>
            <div className="flower__leaf flower__leaf--2"></div>
            <div className="flower__leaf flower__leaf--3"></div>
            <div className="flower__leaf flower__leaf--4"></div>
            <div className="flower__white-circle"></div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flower__light flower__light--${i + 1}`}></div>
            ))}
          </div>
          <div className="flower__line">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`}></div>
            ))}
          </div>
        </div>

        <div className="flower flower--3">
          <div className="flower__leafs flower__leafs--3">
            <div className="flower__leaf flower__leaf--1"></div>
            <div className="flower__leaf flower__leaf--2"></div>
            <div className="flower__leaf flower__leaf--3"></div>
            <div className="flower__leaf flower__leaf--4"></div>
            <div className="flower__white-circle"></div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flower__light flower__light--${i + 1}`}></div>
            ))}
          </div>
          <div className="flower__line">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`}></div>
            ))}
          </div>
        </div>

        {/* Grass and decorative elements */}
        <div className="grow-ans" style={{ '--d': '1.2s' } as React.CSSProperties}>
          <div className="flower__g-long">
            <div className="flower__g-long__top"></div>
            <div className="flower__g-long__bottom"></div>
          </div>
        </div>

        {[1, 2].map((num) => (
          <div key={num} className="growing-grass">
            <div className={`flower__grass flower__grass--${num}`}>
              <div className="flower__grass--top"></div>
              <div className="flower__grass--bottom"></div>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`flower__grass__leaf flower__grass__leaf--${i + 1}`}></div>
              ))}
              <div className="flower__grass__overlay"></div>
            </div>
          </div>
        ))}

        <div className="grow-ans" style={{ '--d': '2.4s' } as React.CSSProperties}>
          <div className="flower__g-right flower__g-right--1">
            <div className="leaf"></div>
          </div>
        </div>

        <div className="grow-ans" style={{ '--d': '2.8s' } as React.CSSProperties}>
          <div className="flower__g-right flower__g-right--2">
            <div className="leaf"></div>
          </div>
        </div>

        <div className="grow-ans" style={{ '--d': '2.8s' } as React.CSSProperties}>
          <div className="flower__g-front">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--${i + 1}`}>
                <div className="flower__g-front__leaf"></div>
              </div>
            ))}
            <div className="flower__g-front__line"></div>
          </div>
        </div>

        <div className="grow-ans" style={{ '--d': '3.2s' } as React.CSSProperties}>
          <div className="flower__g-fr">
            <div className="leaf"></div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flower__g-fr__leaf flower__g-fr__leaf--${i + 1}`}></div>
            ))}
          </div>
        </div>

        {[...Array(8)].map((_, i) => (
          <div key={i} className={`long-g long-g--${i}`}>
            {[...Array(4)].map((_, j) => (
              <div
                key={j}
                className="grow-ans"
                style={{ '--d': `${3 + i * 0.2 + j * 0.2}s` } as React.CSSProperties}
              >
                <div className={`leaf leaf--${j}`}></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showMessage && (
        <div className="valentine-message">
          <h1 className="message-text">Will you be my valentine?</h1>
        </div>
      )}

      {!started && (
        <div className="start-hint">tap to grow a magic garden</div>
      )}
    </div>
  );
}

export default App;