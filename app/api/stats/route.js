
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const total = db.prepare('SELECT COUNT(*) as count FROM guests').get().count;
        const confirmed = db.prepare('SELECT COUNT(*) as count FROM guests WHERE confirmed = 1').get().count;

        return NextResponse.json({
            total_guests: total,
            confirmed_guests: confirmed,
            last_update: new Date().toISOString()
        });
    } catch (e) {
        return NextResponse.json({ error: 'Erro ao calcular estatísticas' }, { status: 500 });
    }
}
