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
      const records = await prisma.pharmacy.findMany({
        take: limit ? parseInt(limit) : 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              email: true,
              personalInfo: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      return NextResponse.json(records);
    }

    // Original single record fetch
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { userId },
    });

    return NextResponse.json(pharmacy);
  } catch (error) {
    console.error('Error fetching pharmacy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pharmacy' },
      { status: 500 }
    );
  }
} 