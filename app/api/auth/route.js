
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { serialize, parse } from 'cookie';


export async function POST(request) {
    try {
        const { cpf, full_name, phone } = await request.json();

        if (!cpf) return NextResponse.json({ error: 'CPF é obrigatório' }, { status: 400 });

        const cleanCpf = cpf.replace(/\D/g, '');

        if (!cleanCpf) return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });

        // Check if exists
        let user = db.prepare('SELECT * FROM guests WHERE cpf = ?').get(cleanCpf);

        if (!user) {
            // Create new user
            if (!full_name) {
                // This might happen if we just try to login, but requirements say we create if not exists.
                // However, we can't create without a name usually.
                // Let's assume the frontend sends name/phone if it's the confirmation step.
                // If it's a "login" step (unlikely per flow, flow is Intro -> Confirmation (Form) -> Home),
                // then we effectively always have the data.
                return NextResponse.json({ error: 'Nome necessário para cadastro' }, { status: 400 });
            }

            const info = db.prepare('INSERT INTO guests (full_name, cpf, phone) VALUES (?, ?, ?)').run(full_name, cleanCpf, phone || '');
            user = db.prepare('SELECT * FROM guests WHERE id = ?').get(info.lastInsertRowid);

            // Simulate WhatsApp Sending Logic
            console.log(`[WhatsApp Service] Sending message to ${phone}: "Olá, ${full_name}! Sua presença no casamento de Larissa & Gabriel foi confirmada 💍✨"`);
        }

        // Set cookie for session
        const cookie = serialize('session_cpf', user.cpf, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        const response = NextResponse.json({ user });
        response.headers.set('Set-Cookie', cookie);
        return response;

    } catch (error) {
        console.error("Auth Error:", error);
        // Handle unique constraint error specifically if needed, but 'get' check covers it mostly.
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const cookieHeader = request.headers.get('cookie');
        const cookies = parse(cookieHeader || '');
        const cpf = cookies.session_cpf;

        if (!cpf) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = db.prepare('SELECT * FROM guests WHERE cpf = ?').get(cpf);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        return NextResponse.json({ user });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
