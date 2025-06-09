import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FormFragment } from '@/types/schema';
import { hash } from 'bcryptjs';

// Create a new user with default admin config
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create user with default admin config
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        adminConfig: {
          create: {
            stepTwoTitle: 'Personal Information',
            stepThreeTitle: 'About Me',
            stepTwoFragments: [FormFragment.PERSONAL_INFO, FormFragment.ADDRESS],
            stepThreeFragments: [FormFragment.ABOUT_ME],
            unusedFragments: [FormFragment.PHARMACY, FormFragment.INSURANCE_INFO]
          }
        }
      },
      include: {
        adminConfig: true
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Get users with pagination or a single user by ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const latest = searchParams.get('latest') === 'true';

    // If userId is provided, fetch a single user
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          adminConfig: true,
          aboutMe: true,
          personalInfo: true,
          address: true,
          pharmacy: true,
          insuranceInfo: true
        }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    }

    // Otherwise, fetch multiple users with pagination
    const users = await prisma.user.findMany({
      take: limit,
      orderBy: {
        createdAt: latest ? 'desc' : 'asc'
      },
      include: {
        adminConfig: true,
        aboutMe: true,
        personalInfo: true,
        address: true,
        pharmacy: true,
        insuranceInfo: true
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 