import Cookies from 'js-cookie';

// Mock data for temporary fallback
const mockStudents = [
  {
    _id: '68af7575951ab7b99b20e39f',
    name: 'Follow Kratos',
    email: 'olumideftoba@gmail.com',
    location: 'Lagos, Nigeria',
    createdAt: '2025-08-29T15:23:00.000Z',
    avatar: null,
    totalCourses: 2,
    progress: 75,
    courses: [
      { courseId: '68af42a8164e9a52c978f410', title: 'dfgresgesgh', progress: 100, nftMetadataUrl: null, tokenId: null },
      { courseId: '68af42a8164e9a52c978f411', title: 'Web Development', progress: 0, nftMetadataUrl: null, tokenId: null },
    ],
  },
];

// Fetch all students from GET /api/students or fallback to GET /api/students/enrolled
export const getAllStudents = async (search = '') => {
  const authData = Cookies.get('_EduGlobal_AUTH_KEY_');
  if (!authData) {
    throw new Error('No authentication data found');
  }

  let token;
  try {
    const parsed = JSON.parse(authData);
    if (parsed.role !== 'admin') {
      throw new Error('Admin role required');
    }
    token = parsed.token;
  } catch (err) {
    console.error('Auth parse error:', err.message);
    throw new Error(`Auth error: ${err.message}`);
  }

  const baseUrl = 'https://eduglobal-servernew-1.onrender.com';
  let url = new URL(`${baseUrl}/api/students`);
  if (search) {
    url.searchParams.append('search', encodeURIComponent(search));
  }

  console.log('Fetching students with URL:', url.toString());

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch failed:', response.status, errorText);

      if (response.status === 404) {
        console.warn('Retrying with fallback endpoint: /api/students/enrolled');
        url = new URL(`${baseUrl}/api/students/enrolled`);
        if (search) {
          url.searchParams.append('search', encodeURIComponent(search));
        }
        const fallbackResponse = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!fallbackResponse.ok) {
          console.warn('Fallback endpoint failed, using mock data');
          return mockStudents
            .filter(
              (student) =>
                student.name.toLowerCase().includes(search.toLowerCase()) ||
                student.email.toLowerCase().includes(search.toLowerCase())
            )
            .map((student) => ({
              id: student._id || 'unknown',
              name: student.name || 'Unknown',
              email: student.email || 'Unknown',
              location: student.location || 'Unknown',
              date: student.createdAt ? new Date(student.createdAt) : new Date(),
              avatar: student.avatar || '/images/default-avatar.png',
              totalCourses: student.totalCourses || 0,
              progress: student.progress || 0,
              courses: student.courses || [],
            }));
        }

        const fallbackData = await fallbackResponse.json();
        if (!fallbackData.studentDetails || !Array.isArray(fallbackData.studentDetails)) {
          console.warn('No valid studentDetails in fallback response:', fallbackData);
          return [];
        }

        return fallbackData.studentDetails.map((student) => ({
          id: student._id || 'unknown',
          name: student.name || 'Unknown',
          email: student.email || 'Unknown',
          location: student.location || 'Unknown',
          date: student.createdAt ? new Date(student.createdAt) : new Date(),
          avatar: student.avatar || '/images/default-avatar.png',
          totalCourses: student.totalCourses || 0,
          progress: student.progress || 0,
          courses: student.courses || [],
        }));
      }

      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired token');
      } else if (response.status === 403) {
        throw new Error('Forbidden: Admin access required');
      }
      throw new Error(`Failed to fetch students: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response:', data);

    if (!data.studentDetails || !Array.isArray(data.studentDetails)) {
      console.warn('No valid studentDetails in response:', data);
      return [];
    }

    return data.studentDetails.map((student) => ({
      id: student._id || 'unknown',
      name: student.name || 'Unknown',
      email: student.email || 'Unknown',
      location: student.location || 'Unknown',
      date: student.createdAt ? new Date(student.createdAt) : new Date(),
      avatar: student.avatar || '/images/default-avatar.png',
      totalCourses: student.totalCourses || 0,
      progress: student.progress || 0,
      courses: student.courses || [],
    }));
  } catch (err) {
    console.error('Fetch error:', err.message);
    throw err;
  }
};