import { useState, useEffect } from 'react';
import { Card, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { FaBook, FaUsers } from 'react-icons/fa';
import CountUp from 'react-countup';
import Cookies from 'js-cookie';

const CounterCard = ({ count, title, icon: Icon, suffix, variant }) => {
  return (
    <Card className={`card-body bg-${variant} bg-opacity-15 p-4 h-100`}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="purecounter mb-0 fw-bold">
            <CountUp end={count} suffix={suffix} delay={1} />
          </h2>
          <span className="mb-0 h6 fw-light">{title}</span>
        </div>
        <div className={`icon-lg rounded-circle bg-${variant} text-white mb-0`}>
          {Icon && <Icon />}
        </div>
      </div>
    </Card>
  );
};

const Counter = () => {
  const [metrics, setMetrics] = useState({
    totalCourses: 0,
    totalStudents: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get JWT token and role
  const getAuthData = () => {
    const authData = Cookies.get('_EduGlobal_AUTH_KEY_');
    if (authData) {
      try {
        return JSON.parse(authData);
      } catch (err) {
        console.error('Failed to parse _EduGlobal_AUTH_KEY_:', err.message);
        return null;
      }
    }
    return null;
  };

  // Fetch courses
  const fetchCourses = async (token) => {
    try {
      const coursesResponse = await fetch('https://eduglobal-servernew-1.onrender.com/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!coursesResponse.ok) {
        throw new Error(`Failed to fetch courses: ${coursesResponse.statusText}`);
      }
      const data = await coursesResponse.json();
      console.log('Fetched courses:', data);

      // Extract courses array and totalCourses from response
      const { courses, totalCourses } = data;
      if (!Array.isArray(courses)) {
        throw new Error('Courses data is not an array');
      }
      return { totalCourses: totalCourses || courses.length };
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      throw err;
    }
  };

  // Fetch total students
  const fetchStudents = async (token) => {
    try {
      const studentsResponse = await fetch('http://localhost:5000/api/total', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!studentsResponse.ok) {
        throw new Error(`Failed to fetch total students: ${studentsResponse.statusText}`);
      }
      const studentsData = await studentsResponse.json();
      console.log('Fetched total students:', studentsData);
      return studentsData.totalStudents || 0;
    } catch (err) {
      console.warn('Error fetching total students:', err.message);
      return 0; // Fallback to 0 if fetch fails
    }
  };

  // Fetch all metrics
  const fetchMetrics = async () => {
    const authData = getAuthData();
    if (!authData || authData.role !== 'admin') {
      setError('Access denied. Admin role required.');
      setLoading(false);
      return;
    }

    const token = authData.token;
    let errors = [];
    let totalCourses = 0;
    let totalStudents = 0;

    // Fetch courses
    try {
      const coursesData = await fetchCourses(token);
      totalCourses = coursesData.totalCourses;
    } catch (err) {
      errors.push(err.message);
    }

    // Fetch students
    try {
      totalStudents = await fetchStudents(token);
    } catch (err) {
      errors.push(err.message);
    }

    setMetrics({
      totalCourses,
      totalStudents,
    });

    if (errors.length > 0) {
      setError(`Failed to load some metrics: ${errors.join('; ')}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Define counter data using fetched metrics
  const counterData = [
    {
      count: metrics.totalCourses,
      title: 'Total Courses',
      icon: FaBook,
      suffix: '',
      variant: 'primary',
    },
    {
      count: metrics.totalStudents,
      title: 'Total Students',
      icon: FaUsers,
      suffix: '',
      variant: 'success',
    },
  ];

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Alert variant="info" className="d-flex align-items-center">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading metrics...
        </Alert>
      ) : (
        <Row className="g-4 mb-4">
          {counterData.map((item, idx) => (
            <Col md={6} xxl={3} key={idx}>
              <CounterCard {...item} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Counter;