import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const ExpenseSchema = z.object({
  amount: z.number(),
  note: z.string().optional(),
  date: z.string().optional(),
  categoryId: z.number(),
});

const JWT_SECRET = process.env.JWT_SECRET!;

function getUserIdFromRequest(req: Request): number | null {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userIdNum = Number(decoded.userId);
    if (isNaN(userIdNum)) return null;
    return userIdNum;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // Return all expenses (no user filtering)
    const expenses = await prisma.expense.findMany({
      include: { category: true },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(expenses);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - token missing or invalid' }, { status: 401 });
    }

    const body = await req.json();
    const data = ExpenseSchema.parse(body);

    const expense = await prisma.expense.create({
      data: {
        amount: data.amount,
        note: data.note,
        date: data.date ? new Date(data.date) : undefined,
        categoryId: data.categoryId,
        userId,  // userId is now a number
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
