import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getUserIdOrThrow } from '@/lib/getUserId';

const CreateCategorySchema = z.object({
  name: z.string().min(1),
  userId: z.number().int().positive(),
});

export async function GET() {
  try {
    // Return all categories (no user filtering)
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, userId } = CreateCategorySchema.parse(body);

    const category = await prisma.category.create({
      data: { name, userId },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}