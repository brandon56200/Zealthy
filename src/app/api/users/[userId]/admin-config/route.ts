import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get admin config for a user
export async function GET(
  request: NextRequest,
  { params }: any 
) {
  try {
    const { userId } = await params;

    const adminConfig = await prisma.adminConfig.findUnique({
      where: { userId },
    });

    if (!adminConfig) {
      return NextResponse.json(
        { error: 'Admin config not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(adminConfig);
  } catch (error) {
    console.error('Error fetching admin config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin config' },
      { status: 500 }
    );
  }
}

// Update admin config for a user
export async function PATCH(
  request: NextRequest,
  { params }: any
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    // Remove any fields that shouldn't be updated directly
    const { id, createdAt, updatedAt, ...updateData } = body;

    const adminConfig = await prisma.adminConfig.update({
      where: { userId },
      data: updateData,
    });

    return NextResponse.json(adminConfig);
  } catch (error) {
    console.error('Error updating admin config:', error);
    return NextResponse.json(
      { error: 'Failed to update admin config' },
      { status: 500 }
    );
  }
} 