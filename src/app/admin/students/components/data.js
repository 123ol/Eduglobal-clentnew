import Cookies from 'js-cookie';

// Fetch all students from GET /api/users/total
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

  const url = new URL('https://eduglobal-servernew-1.onrender.com/api/total');
  if (search) {
    url.searchParams.append('search', encodeURIComponent(search));
  }

  console.log('Fetching students with URL:', url.toString());

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch failed:', response.status, errorText);
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
      location: student.email?.split('@')[1] || 'Unknown', // Placeholder
      totalCourse: student.enrolledCoursesCount || 0,
      progress: Math.floor(Math.random() * 100), // Placeholder
      date: student.createdAt ? new Date(student.createdAt) : new Date(), // Use createdAt or fallback
      avatar: `https://i.pravatar.cc/150?u=${student._id || 'unknown'}`, // Placeholder
    }));
  } catch (err) {
    console.error('Fetch error:', err.message);
    throw err;
  }
};
