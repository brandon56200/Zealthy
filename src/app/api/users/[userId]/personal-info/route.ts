import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const latest = searchParams.get('latest') === 'true';

    if (latest) {
      const records = await prisma.personalInfo.findMany({
        take: limit ? parseInt(limit) : 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      });

      return NextResponse.json(records);
    }

    // Original single record fetch
    const personalInfo = await prisma.personalInfo.findUnique({
      where: { userId },
    });

    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error('Error fetching personal info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personal info' },
      { status: 500 }
    );
  }
} 