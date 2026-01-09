
'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function DovesBackground() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Não exibir na página de confirmação
    if (pathname === '/confirmacao') return null;
    if (!mounted) return null;

    return (
        <div className="doves-container">
            <div className="dove dove-1">
                <DoveSVG />
            </div>
            <div className="dove dove-2">
                <DoveSVG />
            </div>
            <div className="dove dove-3">
                <DoveSVG />
            </div>
            <div className="dove dove-4">
                <DoveSVG />
            </div>
            <div className="dove dove-5">
                <DoveSVG />
            </div>
        </div>
    );
}

function DoveSVG() {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
                src="/dove.png"
                alt="Dove"
                fill
                style={{ objectFit: 'contain' }}
            />
        </div>
    );
}
