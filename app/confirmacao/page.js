
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Confirmacao() {
    const router = useRouter();
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', cpf: '', phone: '' });

    const formatCPF = (v) => {
        v = v.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const formatPhone = (v) => {
        v = v.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (name === 'cpf') finalValue = formatCPF(value);
        if (name === 'phone') finalValue = formatPhone(value);
        setFormData({ ...formData, [name]: finalValue });
    }

    const handleSubmit = async (e, mode = 'register') => {
        e.preventDefault();
        setLoading(true);

        // For login mode, we only send CPF.
        // For register mode, we send all fields.
        const payload = mode === 'login' ? { cpf: formData.cpf } : formData;

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                router.push('/inicio');
            } else {
                // Specialized error message for login attempt
                if (mode === 'login' && data.error && (data.error.includes('Nome necessário') || data.error.includes('Nome'))) {
                    alert('CPF não encontrado. Por favor, toque na imagem para confirmar sua presença pela primeira vez.');
                } else {
                    alert(data.error || 'Erro ao processar');
                }
            }
        } catch (err) {
            alert('Erro na conexão');
        }
        setLoading(false);
    };

    const handleImageClick = () => {
        setShowRegisterModal(true);
    };

    const handleLoginClick = (e) => {
        e.stopPropagation(); // Prevent triggering the image click
        setShowLoginModal(true);
    };

    return (
        <div className="container" style={{ padding: 0, maxWidth: '100%', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Full Screen Image Clickable Area */}
            <div
                onClick={handleImageClick}
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundImage: 'url(/invite-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    zIndex: 1
                }}
            >
                {/* Hint overlay (optional, but good for UX so they know to click) */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }}>
                    <span className="btn">Clique para abrir</span>
                </div>
            </div>

            {/* Minimalist Button fixed at bottom */}
            <div style={{ position: 'fixed', bottom: '30px', width: '100%', textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
                <button
                    onClick={handleLoginClick}
                    style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid var(--color-gold)',
                        color: 'var(--color-primary)',
                        padding: '10px 24px',
                        borderRadius: '30px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    Já confirmei minha presença
                </button>
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
                {showRegisterModal && (
                    <Modal onClose={() => setShowRegisterModal(false)}>
                        <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '20px', textAlign: 'center' }}>
                            Confirmar Presença
                        </h3>
                        <form onSubmit={(e) => handleSubmit(e, 'register')}>
                            <input name="full_name" className="input-field" type="text" placeholder="Nome Completo" required value={formData.full_name} onChange={handleChange} />
                            <input name="cpf" className="input-field" type="text" placeholder="CPF" required maxLength={14} value={formData.cpf} onChange={handleChange} />
                            <input name="phone" className="input-field" type="tel" placeholder="Telefone (WhatsApp)" required value={formData.phone} onChange={handleChange} />
                            <button type="submit" className="btn" disabled={loading} style={{ marginTop: '10px' }}>
                                {loading ? 'Confirmando...' : 'Confirmar & Entrar'}
                            </button>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

            {/* Login Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <Modal onClose={() => setShowLoginModal(false)}>
                        <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '20px', textAlign: 'center' }}>
                            Acessar Convite
                        </h3>
                        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>Informe seu CPF para acessar.</p>
                        <form onSubmit={(e) => handleSubmit(e, 'login')}>
                            <input name="cpf" className="input-field" type="text" placeholder="CPF" required maxLength={14} value={formData.cpf} onChange={handleChange} />
                            <button type="submit" className="btn" disabled={loading} style={{ marginTop: '10px' }}>
                                {loading ? 'Verificando...' : 'Entrar'}
                            </button>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}

function Modal({ children, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(45, 71, 57, 0.4)', backdropFilter: 'blur(8px)',
                zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                style={{
                    background: 'var(--bg-color)',
                    width: '100%',
                    maxWidth: '500px',
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px',
                    padding: '30px',
                    paddingBottom: '50px',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.2)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ width: '40px', height: '4px', background: '#ccc', borderRadius: '2px', margin: '0 auto 20px auto' }} />
                {children}
                <button
                    onClick={onClose}
                    style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#999', width: '100%', padding: '10px', cursor: 'pointer' }}
                >
                    Cancelar
                </button>
            </motion.div>
        </motion.div>
    );
}
