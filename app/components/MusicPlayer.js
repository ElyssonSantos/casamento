'use client';
import { useState, useRef, useEffect } from 'react';

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Attempt to play immediately on mount
        const tryPlay = async () => {
            if (audioRef.current) {
                audioRef.current.volume = 0.2; // Volume ajustado para 20%
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (err) {
                    // Expected behavior on modern browsers.
                    // We silently catch this because we have interaction listeners ready.
                    setIsPlaying(false);
                }
            }
        };

        tryPlay();

        // Fallback: Play on any first interaction (click/touch/scroll)
        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused && !error) {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.error("Interação falhou ao iniciar áudio", e));
            }
        };

        // Add listeners for multiple interaction types to maximize chance of playing
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });
        window.addEventListener('scroll', handleInteraction, { once: true });

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
        };
    }, [error]);

    const togglePlay = () => {
        if (audioRef.current && !error) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleError = () => {
        console.error("Erro ao carregar arquivo de música.");
        setError(true);
        setIsPlaying(false);
    }

    if (error) return null;

    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
            <audio
                ref={audioRef}
                loop
                autoPlay
                src="https://res.cloudinary.com/dedtkwg0m/video/upload/v1767987881/Turning_Page_-_Sleeping_At_Last_youtube_1_gjtpy1.mp3"
                onError={handleError}
            />
            <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pausar música" : "Tocar música"}
                style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    color: 'var(--color-primary)',
                    transition: 'all 0.3s ease',
                    opacity: 0.8
                }}
            >
                {isPlaying ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
            </button>
        </div>
    );
}
