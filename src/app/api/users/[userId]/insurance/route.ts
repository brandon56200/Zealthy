import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const { userId } = params;

    const insurance = await prisma.insuranceInfo.findUnique({
      where: { userId },
    });

    return NextResponse.json(insurance);
  } catch (error) {
    console.error('Error fetching insurance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insurance' },
      { status: 500 }
    );
  }
} 