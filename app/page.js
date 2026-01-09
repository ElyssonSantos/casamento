
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
  "O destino nos uniu...",
  "O amor nos guiou...",
  "Para sempre...",
  "Larissa & Gabriel"
];

export default function Intro() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Redirect after 10s
    const timer = setTimeout(() => {
      router.push('/confirmacao');
    }, 10000);

    // Cycle phrases every 2.5s
    const phraseInterval = setInterval(() => {
      setIndex(prev => {
        if (prev < phrases.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(phraseInterval);
    };
  }, [router]);

  return (
    <div className="container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ padding: '0 20px' }}
        >
          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: index === phrases.length - 1 ? '3rem' : '1.8rem',
            color: 'var(--color-primary)',
            lineHeight: 1.4
          }}>
            {phrases[index]}
          </h1>
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div style={{ position: 'fixed', bottom: '50px', width: '60%', maxWidth: '200px', height: '2px', background: 'rgba(94, 125, 99, 0.2)', borderRadius: '1px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 10, ease: 'linear' }}
          style={{ height: '100%', background: 'var(--color-gold)' }}
        />
      </div>
    </div>
  );
}
