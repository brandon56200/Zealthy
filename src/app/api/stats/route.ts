import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total users
    const totalUsers = await prisma.user.count();

    // Get newest user
    const newestUser = await prisma.user.findFirst({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        personalInfo: true
      }
    });

    // Get users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const newUsersLastWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    // Calculate completion rate
    const usersWithAllForms = await prisma.user.count({
      where: {
        AND: [
          { aboutMe: { isNot: null } },
          { personalInfo: { isNot: null } },
          { address: { isNot: null } },
          { pharmacy: { isNot: null } },
          { insuranceInfo: { isNot: null } }
        ]
      }
    });

    const completionRate = totalUsers > 0 
      ? (usersWithAllForms / totalUsers) * 100 
      : 0;

    return NextResponse.json({
      totalUsers,
      newestUser: newestUser ? {
        id: newestUser.id,
        email: newestUser.email,
        name: newestUser.personalInfo 
          ? `${newestUser.personalInfo.firstName} ${newestUser.personalInfo.lastName}`
          : newestUser.email,
        createdAt: newestUser.createdAt
      } : null,
      newUsersLastWeek,
      completionRate: Math.round(completionRate * 100) / 100 // Round to 2 decimal places
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 