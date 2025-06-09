import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Update user information
export async function PATCH(
  request: Request,
  { params }: any 
) {
  try {
    const { userId } = params;
    const body = await request.json();

    // Remove any fields that shouldn't be updated directly
    const { id, createdAt, updatedAt, ...updateData } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        adminConfig: true,
        aboutMe: true,
        personalInfo: true,
        address: true,
        pharmacy: true,
        insuranceInfo: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 