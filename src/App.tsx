import React, { useState, useRef, useMemo } from 'react';
import './App.css';

type Phase = 'opening' | 'thoughts' | 'game' | 'bridge' | 'ask';

function App() {
  const [phase, setPhase] = useState<Phase>('opening');
  const [started, setStarted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [removedPetals, setRemovedPetals] = useState<number[]>([]);
  const [thoughtStep, setThoughtStep] = useState(0);
  const [bridgeStep, setBridgeStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const idleMusicRef = useRef<HTMLAudioElement>(null);
  const bloomMusicRef = useRef<HTMLAudioElement>(null);

  const gamePetalsCount = 13;

  const thoughts = [
    "Sometimes I wonder how I got this lucky.",
    "You live in my thoughts more than you know.",
    "So I thought… I should finally say it properly.",
    "But I think."
  ];

  const bridgeLines = [
    "I was nervous making this.",
    "But some things are worth the risk."
  ];

  const handleGlobalClick = () => {
    if (!audioUnlocked) {
      [idleMusicRef, bloomMusicRef].forEach(ref => {
        if (ref.current) {
          // Set initial volumes
          if (ref === idleMusicRef) ref.current.volume = 0.3;
          if (ref === bloomMusicRef) ref.current.volume = 0;

          ref.current.play().then(() => {
            if (ref === bloomMusicRef || phase !== 'opening') {
              ref.current?.pause();
            }
          }).catch(() => { });
        }
      });
      setAudioUnlocked(true);

      // If we are in opening phase, the first click should also kick off the transition
      if (phase === 'opening') {
        setIsNavigating(true);
        setTimeout(() => {
          setPhase('thoughts');
          setIsNavigating(false);
        }, 1000);
      }
      return;
    }

    if (phase === 'opening') {
      if (idleMusicRef.current) {
        idleMusicRef.current.volume = 0.3;
        idleMusicRef.current.play().catch(err => console.log('Music play failed:', err));
      }
      setIsNavigating(true);
      setTimeout(() => {
        setPhase('thoughts');
        setIsNavigating(false);
      }, 1000);
    } else if (phase === 'thoughts') {
      if (thoughtStep < thoughts.length - 1) {
        setThoughtStep(prev => prev + 1);
      } else {
        setIsNavigating(true);
        // Ensure audio is playing during transition to game
        if (bloomMusicRef.current) {
          bloomMusicRef.current.play().catch(() => { });
        }
        setTimeout(() => {
          setPhase('game');
          setIsNavigating(false);
        }, 1000);
      }
    } else if (phase === 'bridge') {
      if (bridgeStep < bridgeLines.length - 1) {
        setBridgeStep(prev => prev + 1);
      } else {
        setTransitioning(true);
        // Phase switch happens at the peak of the white-out
        setTimeout(() => {
          setPhase('ask');
          startGardenSequence();
        }, 1500);

        // Remove the overlay after it has had time to fade back out
        setTimeout(() => {
          setTransitioning(false);
        }, 3000);
      }
    }
  };

  const startGardenSequence = () => {
    setStarted(true);

    if (bloomMusicRef.current) {
      bloomMusicRef.current.volume = 0;
      bloomMusicRef.current.play();
      const fadeIn = setInterval(() => {
        if (bloomMusicRef.current && bloomMusicRef.current.volume < 0.7) {
          bloomMusicRef.current.volume += 0.05;
        } else {
          clearInterval(fadeIn);
        }
      }, 100);
    }
  };

  const handlePetalClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!removedPetals.includes(index) && phase === 'game') {
      const newRemoved = [...removedPetals, index];
      setRemovedPetals(newRemoved);

      if (newRemoved.length === gamePetalsCount) {
        setTimeout(() => {
          setPhase('bridge');
        }, 1500);
      }
    }
  };

  const getGameText = () => {
    if (removedPetals.length === 0) return "We should leave it to fate.";
    if (removedPetals.length === gamePetalsCount) return "She loves me.";
    return removedPetals.length % 2 === 1 ? "She loves me" : "She loves me not";
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
    <div className={`app phase-${phase}`} onClick={handleGlobalClick}>
      <audio
        ref={idleMusicRef}
        loop
        preload="auto"
        src={`${import.meta.env.BASE_URL}/audio/idle.mp3`.replace(/\/+/g, '/')}
      >
        <source src={`${import.meta.env.BASE_URL}/audio/idle.mp3`.replace(/\/+/g, '/')} type="audio/mpeg" />
      </audio>
      <audio
        ref={bloomMusicRef}
        preload="auto"
        src={`${import.meta.env.BASE_URL}/audio/bloom.mp3`.replace(/\/+/g, '/')}
      >
        <source src={`${import.meta.env.BASE_URL}/audio/bloom.mp3`.replace(/\/+/g, '/')} type="audio/mpeg" />
      </audio>

      <div className="night"></div>

      {phase !== 'opening' && phase !== 'thoughts' && (
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
      )}

      {(phase === 'opening' || phase === 'thoughts' || phase === 'bridge') && (
        <div className={`narrative-container ${isNavigating ? 'hidden' : ''}`}>
          <div className="poetic-text">
            {phase === 'opening' && <div className="thought-line visible">I made something for you.</div>}

            {phase === 'thoughts' && Array.from({ length: thoughtStep + 1 }).map((_, i) => (
              <div key={i} className={`thought-line visible ${i < thoughtStep ? 'historical' : ''}`}>{thoughts[i]}</div>
            ))}

            {phase === 'bridge' && Array.from({ length: bridgeStep + 1 }).map((_, i) => (
              <div key={i} className={`thought-line visible ${i < bridgeStep ? 'historical' : ''}`}>{bridgeLines[i]}</div>
            ))}
          </div>
          <p className="click-hint">tap to continue</p>
        </div>
      )}

      {phase === 'game' && (
        <>
          <div className="game-container">
            <div className={`game-text ${removedPetals.length === gamePetalsCount ? 'final' : ''}`}>
              {getGameText()}
            </div>
            <div className="daisy">
              <div className="daisy-center"></div>
              {[...Array(gamePetalsCount)].map((_, i) => (
                <div
                  key={i}
                  className={`daisy-petal ${removedPetals.includes(i) ? 'removed' : ''}`}
                  style={{ '--i': i, '--total': gamePetalsCount } as React.CSSProperties}
                  onClick={(e) => handlePetalClick(i, e)}
                ></div>
              ))}
            </div>
          </div>
        </>
      )}

      {transitioning && (
        <div className="cloud-transition-overlay">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="transition-cloud" style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              animationDelay: `${i * 0.2}s`
            } as React.CSSProperties}></div>
          ))}
        </div>
      )}

      {phase === 'ask' && (
        <div className="garden-phase">
          <div className="bottom-gradient"></div>
          {started && <div className="garden-glow"></div>}
          <div className="flowers">
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

          <div className="valentine-ask-message">
            <h1 className="message-text">May, you be my valentine?</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;