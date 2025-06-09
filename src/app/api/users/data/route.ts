import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Fetch latest users
    const users = await prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        personalInfo: true
      }
    });

    // Fetch latest about me entries
    const aboutMe = await prisma.aboutMe.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            personalInfo: true
          }
        }
      }
    });

    // Fetch latest address entries
    const addresses = await prisma.address.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            personalInfo: true
          }
        }
      }
    });

    // Fetch latest admin config entries
    const adminConfigs = await prisma.adminConfig.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            personalInfo: true
          }
        }
      }
    });

    // Fetch latest insurance info entries
    const insuranceInfo = await prisma.insuranceInfo.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            personalInfo: true
          }
        }
      }
    });

    // Fetch latest personal info entries
    const personalInfo = await prisma.personalInfo.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    // Fetch latest pharmacy entries
    const pharmacies = await prisma.pharmacy.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            personalInfo: true
          }
        }
      }
    });

    return NextResponse.json({
      users,
      aboutMe,
      addresses,
      adminConfigs,
      insuranceInfo,
      personalInfo,
      pharmacies
    });
  } catch (error) {
    console.error('Error fetching users for data display:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 