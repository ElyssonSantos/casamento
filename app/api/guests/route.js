
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const guests = db.prepare('SELECT * FROM guests ORDER BY created_at DESC').all();
        return NextResponse.json({ guests });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar convidados' }, { status: 500 });
    }
}
