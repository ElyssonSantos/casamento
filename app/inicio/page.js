
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Inicio() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    // SECRET BACKDOOR STATE
    const [clicks, setClicks] = useState(0);
    const [showSecret, setShowSecret] = useState(false);
    const [secretCpf, setSecretCpf] = useState('');

    useEffect(() => {
        fetch('/api/auth')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Unauthorized');
            })
            .then(data => setUser(data.user))
            .catch(() => router.push('/confirmacao'));
    }, [router]);

    // Secret Click Logic (3 clicks in 3s)
    useEffect(() => {
        if (clicks === 0) return;
        const timer = setTimeout(() => setClicks(0), 3000);
        if (clicks >= 3) {
            setShowSecret(true);
            setClicks(0);
        }
        return () => clearTimeout(timer);
    }, [clicks]);

    const handleFooterClick = () => setClicks(p => p + 1);

    const handleSecretSubmit = (e) => {
        e.preventDefault();
        // Validate CPF: 08980266529
        if (secretCpf.replace(/\D/g, '') === '08980266529') {
            document.cookie = "admin_access=true; path=/; max-age=3600"; // 1 hour access
            router.push('/admin');
        } else {
            alert("CPF não liberado");
        }
    };

    if (!user) return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-primary)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ width: '50px', height: '50px', border: '2px solid rgba(197, 160, 89, 0.2)', borderTopColor: 'var(--color-gold)', borderRadius: '50%' }} />
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="container" style={{ padding: '0 20px', maxWidth: '600px' }}>

            {/* HEADER EMOCIONAL */}
            <motion.header
                style={{ padding: '80px 0 60px', textAlign: 'center', position: 'relative' }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Decorative Top Line */}
                <motion.div variants={itemVariants} style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, transparent, var(--color-gold))', margin: '0 auto 20px', opacity: 0.6 }} />

                <motion.p variants={itemVariants} style={{ fontFamily: 'var(--font-bree)', color: 'var(--color-primary)', fontSize: '1rem', letterSpacing: '1px', marginBottom: '15px', opacity: 0.8 }}>
                    Bem-vindo(a), {user.full_name.split(' ')[0]}
                </motion.p>

                <motion.div variants={itemVariants} style={{ position: 'relative', padding: '0 20px' }}>
                    <h1 style={{ fontFamily: 'var(--font-vibes)', color: 'var(--color-gold)', fontSize: '4.5rem', lineHeight: '1.2', textShadow: '0 2px 10px rgba(197, 160, 89, 0.2)' }}>
                        Larissa <br /> <span style={{ fontSize: '0.6em', verticalAlign: 'middle', color: 'var(--color-primary-dark)' }}>&</span> Gabriel
                    </h1>
                    {/* Subtitle Date */}
                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                        <span style={{ height: '1px', width: '40px', background: 'var(--color-gold)', opacity: 0.5 }}></span>
                        <span style={{ fontFamily: 'var(--font-bree)', color: 'var(--color-primary-dark)', fontSize: '1.1rem', letterSpacing: '2px' }}>17 . 10 . 2026</span>
                        <span style={{ height: '1px', width: '40px', background: 'var(--color-gold)', opacity: 0.5 }}></span>
                    </div>
                </motion.div>
            </motion.header>

            {/* SEÇÃO 1: O GRANDE DIA */}
            <motion.section
                className="premium-card"
                style={{ marginBottom: '40px', textAlign: 'center' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={itemVariants}
            >
                <div style={{ marginBottom: '25px' }}>
                    <span style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '20px', background: 'rgba(197, 160, 89, 0.1)', color: 'var(--color-gold)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Cerimônia</span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-vibes)', color: 'var(--color-primary-dark)', fontSize: '2.8rem', marginBottom: '15px' }}> nao sei o lugar</h2>

                <p style={{ fontFamily: 'var(--font-bree)', color: '#666', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '25px' }}>
            SMPW Quadra 6 - Park Way<br />Brasília - DF
                </p>

                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--color-primary)', fontFamily: 'var(--font-bree)', background: '#F5F7F5', padding: '10px 25px', borderRadius: '12px' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Às 16:00 horas</span>
                </div>

                <button className="btn" style={{ marginTop: '35px', fontSize: '1rem' }}>Ver Localização</button>
            </motion.section>

            {/* SEÇÃO 2: INFORMAÇÕES */}
            <motion.section
                style={{ marginBottom: '50px' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
            >
                <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h3 style={{ fontFamily: 'var(--font-bree)', fontSize: '1.5rem', color: 'var(--color-primary-dark)' }}>Informações Importantes</h3>
                    <div style={{ width: '40px', height: '3px', background: 'var(--color-gold)', margin: '10px auto 0', borderRadius: '2px' }} />
                </motion.div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    <InfoCard
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                        title="Evento Intimista"
                        text="Preparamos uma celebração exclusiva para as pessoas que mais amamos."
                    />
                    <InfoCard
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="Confirmação"
                        text="Sua presença já está confirmada em nossa lista. Obrigado por fazer parte!"
                    />
                    <InfoCard
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                        title="Adults Only"
                        text="Para que todos possam aproveitar, o evento será reservado para adultos."
                    />
                </div>
            </motion.section>

            {/* SEÇÃO 3: DRESS CODE */}
            <motion.section
                className="premium-card"
                style={{ marginBottom: '80px', padding: '40px 20px' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={itemVariants}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontFamily: 'var(--font-vibes)', color: 'var(--color-gold)', fontSize: '3rem', lineHeight: '0.8' }}>Dress Code</h2>
                    <p style={{ fontFamily: 'var(--font-bree)', color: '#888', fontSize: '0.9rem', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Passeio Completo</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '50px', height: '50px', background: '#F0EFEA', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                            <span style={{ fontFamily: 'var(--font-vibes)', fontSize: '1.8rem' }}>E</span>
                        </div>
                        <h4 style={{ fontFamily: 'var(--font-bree)', color: 'var(--color-primary-dark)', fontSize: '1.2rem', marginBottom: '5px' }}>Para Eles</h4>
                        <p style={{ color: '#666', fontSize: '0.95rem' }}>Terno escuro e gravata.</p>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.06)' }} />

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '50px', height: '50px', background: '#F0EFEA', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                            <span style={{ fontFamily: 'var(--font-vibes)', fontSize: '1.8rem' }}>A</span>
                        </div>
                        <h4 style={{ fontFamily: 'var(--font-bree)', color: 'var(--color-primary-dark)', fontSize: '1.2rem', marginBottom: '5px' }}>Para Elas</h4>
                        <p style={{ color: '#666', fontSize: '0.95rem' }}>Longo ou Midi elegante.</p>
                    </div>
                </div>

                <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(94, 125, 99, 0.05)', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                        Pedimos gentilmente que evitem as cores:<br />
                        <span style={{ color: 'var(--color-primary-dark)', fontWeight: 'bold' }}>Branco, Off-white e Verde Escuro</span>
                    </p>
                </div>
            </motion.section>

            <footer style={{ textAlign: 'center', paddingBottom: '60px' }}>
                <p
                    onClick={handleFooterClick}
                    style={{
                        fontFamily: 'var(--font-vibes)',
                        fontSize: '1.8rem',
                        color: 'var(--color-gold)',
                        opacity: 0.8,
                        cursor: 'pointer',
                        userSelect: 'none'
                    }}
                >
                    Estamos te esperando!
                </p>
            </footer>

            {/* SECRET ADMIN MODAL */}
            <AnimatePresence>
                {showSecret && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="premium-card"
                            style={{ width: '90%', maxWidth: '350px', background: '#fff' }}
                        >
                            <h3 style={{ fontFamily: 'var(--font-bree)', color: 'var(--color-primary-dark)', textAlign: 'center', marginBottom: '20px' }}>Área Restrita</h3>
                            <form onSubmit={handleSecretSubmit}>
                                <input
                                    type="text"
                                    placeholder="Digite o CPF..."
                                    value={secretCpf}
                                    onChange={e => setSecretCpf(e.target.value)}
                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', marginBottom: '20px' }}
                                    autoFocus
                                />
                                <button type="submit" className="btn">Entrar</button>
                            </form>
                            <button onClick={() => setShowSecret(false)} style={{ width: '100%', background: 'transparent', border: 'none', marginTop: '15px', color: '#999', cursor: 'pointer' }}>Cancelar</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoCard({ icon, title, text }) {
    return (
        <motion.div
            style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
            whileHover={{ y: -3 }}
        >
            <div style={{ color: 'var(--color-gold)', background: 'rgba(197, 160, 89, 0.1)', padding: '10px', borderRadius: '12px' }}>
                {icon}
            </div>
            <div>
                <h4 style={{ fontFamily: 'var(--font-bree)', color: 'var(--color-primary-dark)', fontSize: '1.1rem', marginBottom: '5px' }}>{title}</h4>
                <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: '1.5' }}>{text}</p>
            </div>
        </motion.div>
    );
}
