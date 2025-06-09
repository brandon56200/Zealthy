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
      const records = await prisma.aboutMe.findMany({
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
    const aboutMe = await prisma.aboutMe.findUnique({
      where: { userId },
    });

    return NextResponse.json(aboutMe);
  } catch (error) {
    console.error('Error fetching about me:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about me' },
      { status: 500 }
    );
  }
} 