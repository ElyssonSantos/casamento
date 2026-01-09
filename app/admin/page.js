
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Admin() {
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [guests, setGuests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // PROTECTION & DATA FETCHING
    useEffect(() => {
        // 1. Check for protection cookie
        if (!document.cookie.includes('admin_access=true')) {
            router.push('/inicio');
            return;
        }

        // 2. Fetch Data
        const fetchData = () => {
            setIsLoading(true);
            Promise.all([
                fetch('/api/stats').then(r => r.json()),
                fetch('/api/guests').then(r => r.json())
            ]).then(([statsData, guestsData]) => {
                setStats(statsData);
                setGuests(guestsData.guests);
                setIsLoading(false);
            });
        };

        fetchData();
        const interval = setInterval(() => {
            fetch('/api/stats').then(r => r.json()).then(setStats);
            fetch('/api/guests').then(r => r.json()).then(d => setGuests(d.guests));
        }, 15000); // Poll every 15s

        return () => clearInterval(interval);
    }, [router]);

    const filteredGuests = guests.filter(g =>
        g.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.cpf.includes(searchTerm)
    );

    const downloadCSV = () => {
        const headers = ["Nome,CPF,Telefone,Confirmado,Data"];
        const rows = guests.map(g =>
            `"${g.full_name}","${g.cpf}","${g.phone}","${g.confirmed ? 'Sim' : 'Não'}","${new Date(g.created_at).toLocaleString('pt-BR')}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "lista_convidados.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handlePrint = () => window.print();

    if (isLoading && !stats) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-primary)' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--color-gold)', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>

            {/* HEADER */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center', marginBottom: '40px' }}
            >
                <h2 style={{ fontFamily: 'var(--font-vibes)', fontSize: '3rem', color: 'var(--color-gold)' }}>Gestão do Casamento</h2>
                <p style={{ fontFamily: 'var(--font-bree)', color: 'var(--color-primary-dark)', opacity: 0.7 }}>Larissa & Gabriel</p>
            </motion.header>

            {/* STATS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <motion.div
                    className="premium-card"
                    style={{ textAlign: 'center', padding: '20px' }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 style={{ fontSize: '3rem', fontFamily: 'var(--font-vibes)', color: 'var(--color-primary-dark)', lineHeight: 1 }}>{stats?.total_guests || 0}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Total de Cadastros</p>
                </motion.div>

                <motion.div
                    className="premium-card"
                    style={{ textAlign: 'center', padding: '20px' }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 style={{ fontSize: '3rem', fontFamily: 'var(--font-vibes)', color: 'var(--color-primary)', lineHeight: 1 }}>{stats?.confirmed_guests || 0}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Confirmados</p>
                </motion.div>
            </div>

            {/* ACTIONS TOOLBAR */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '15px 20px', borderRadius: '50px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.8)', fontSize: '1rem', outline: 'none' }}
                    />
                </div>
                <button onClick={downloadCSV} style={{ background: '#fff', border: '1px solid #ddd', padding: '12px', borderRadius: '50%', cursor: 'pointer', color: 'var(--color-primary)' }} title="Exportar CSV">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
                <button onClick={handlePrint} style={{ background: '#fff', border: '1px solid #ddd', padding: '12px', borderRadius: '50%', cursor: 'pointer', color: 'var(--color-primary)' }} title="Imprimir">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                </button>
            </div>

            {/* GUEST LIST (Mobile-First Card View) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {filteredGuests.map((guest, idx) => (
                    <motion.div
                        key={guest.cpf}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="premium-card"
                        style={{ borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(94, 125, 99, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-vibes)', fontSize: '1.5rem' }}>
                                {guest.full_name[0]}
                            </div>
                            <div>
                                <h4 style={{ fontFamily: 'var(--font-bree)', fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>{guest.full_name}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#999', fontFamily: 'monospace' }}>{guest.cpf}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <a href={`https://wa.me/55${guest.phone.replace(/\D/g, '')}`} target="_blank" style={{ padding: '10px', borderRadius: '50%', background: '#F0F9F0', color: '#25D366' }}>
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

            {guests.length > 0 && filteredGuests.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '40px', color: '#999' }}>Nenhum convidado encontrado.</p>
            )}

            <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.8rem', opacity: 0.5 }}>
                Atualizado em tempo real ({new Date().toLocaleTimeString('pt-BR')})
            </div>
        </div>
    );
}
