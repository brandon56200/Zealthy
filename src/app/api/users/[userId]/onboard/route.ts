import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: any
) {
  try {
    // Get auth token from cookie
    const cookies = request.headers.get('cookie');
    console.log('Cookies:', cookies);
    
    const authToken = cookies?.split(';')
      .find(c => c.trim().startsWith('auth-token='))
      ?.split('=')[1];

    console.log('Auth token:', authToken ? 'Present' : 'Missing');

    if (!authToken) {
      console.error('No auth token found in cookies');
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(authToken);
    console.log('Decoded token:', decoded);

    if (!decoded) {
      console.error('Failed to verify token');
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    const { userId } = params;
    console.log('User ID from params:', userId);
    console.log('User ID from token:', decoded.userId);

    if (decoded.userId !== userId) {
      console.error('User ID mismatch:', { paramId: userId, tokenId: decoded.userId });
      return NextResponse.json({ error: 'Unauthorized - User ID mismatch' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    const { stepTwoData, stepThreeData } = body;

    // Process data from both steps
    const processData = async (data: any) => {
      if (!data) return;

      if (data.personalInfo) {
        console.log('Processing personal info:', JSON.stringify(data.personalInfo, null, 2));
        try {
          const personalInfo = await prisma.personalInfo.upsert({
            where: { userId },
            update: {
              firstName: data.personalInfo.firstName,
              lastName: data.personalInfo.lastName,
              dateOfBirth: new Date(data.personalInfo.dateOfBirth),
              gender: data.personalInfo.gender,
            },
            create: {
              userId,
              firstName: data.personalInfo.firstName,
              lastName: data.personalInfo.lastName,
              dateOfBirth: new Date(data.personalInfo.dateOfBirth),
              gender: data.personalInfo.gender,
            },
          });
          console.log('Personal info saved:', personalInfo);
        } catch (error) {
          console.error('Error upserting personal info:', error);
          throw error;
        }
      }

      if (data.address) {
        console.log('Processing address:', JSON.stringify(data.address, null, 2));
        try {
          const address = await prisma.address.upsert({
            where: { userId },
            update: {
              address: data.address.address,
              city: data.address.city,
              state: data.address.state,
              zipCode: data.address.zipCode,
            },
            create: {
              userId,
              address: data.address.address,
              city: data.address.city,
              state: data.address.state,
              zipCode: data.address.zipCode,
            },
          });
          console.log('Address saved:', address);
        } catch (error) {
          console.error('Error upserting address:', error);
          throw error;
        }
      }

      if (data.pharmacy) {
        console.log('Processing pharmacy:', JSON.stringify(data.pharmacy, null, 2));
        try {
          const pharmacy = await prisma.pharmacy.upsert({
            where: { userId },
            update: {
              pharmacyName: data.pharmacy.pharmacyName,
              address: data.pharmacy.address,
              city: data.pharmacy.city,
              state: data.pharmacy.state,
              zipCode: data.pharmacy.zipCode,
              phoneNumber: data.pharmacy.phoneNumber,
            },
            create: {
              userId,
              pharmacyName: data.pharmacy.pharmacyName,
              address: data.pharmacy.address,
              city: data.pharmacy.city,
              state: data.pharmacy.state,
              zipCode: data.pharmacy.zipCode,
              phoneNumber: data.pharmacy.phoneNumber,
            },
          });
          console.log('Pharmacy saved:', pharmacy);
        } catch (error) {
          console.error('Error upserting pharmacy:', error);
          throw error;
        }
      }

      if (data.insurance) {
        console.log('Processing insurance:', JSON.stringify(data.insurance, null, 2));
        try {
          // Only include fields that have values
          const insuranceData = {
            provider: data.insurance.provider,
            policyNumber: data.insurance.policyNumber,
            startDate: new Date(data.insurance.startDate),
            ...(data.insurance.groupNumber ? { groupNumber: data.insurance.groupNumber } : {}),
            ...(data.insurance.endDate ? { endDate: new Date(data.insurance.endDate) } : {})
          };

          console.log('Insurance data prepared for database:', insuranceData);

          const insurance = await prisma.insuranceInfo.upsert({
            where: { userId },
            update: insuranceData,
            create: {
              userId,
              ...insuranceData
            },
          });
          console.log('Insurance saved:', insurance);
        } catch (error: any) {
          console.error('Error upserting insurance:', error);
          console.error('Error details:', {
            message: error?.message,
            code: error?.code,
            meta: error?.meta
          });
          throw error;
        }
      }

      if (data.aboutMe) {
        console.log('Processing about me:', JSON.stringify(data.aboutMe, null, 2));
        try {
          const aboutMe = await prisma.aboutMe.upsert({
            where: { userId },
            update: {
              healthGoals: data.aboutMe.healthGoals,
              lifestyle: data.aboutMe.lifestyle,
              healthHistory: data.aboutMe.healthHistory,
              preferences: data.aboutMe.preferences,
            },
            create: {
              userId,
              healthGoals: data.aboutMe.healthGoals,
              lifestyle: data.aboutMe.lifestyle,
              healthHistory: data.aboutMe.healthHistory,
              preferences: data.aboutMe.preferences,
            },
          });
          console.log('About me saved:', aboutMe);
        } catch (error) {
          console.error('Error upserting about me:', error);
          throw error;
        }
      }
    };

    // Process data from both steps
    await processData(stepTwoData);
    await processData(stepThreeData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in onboard route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
} 