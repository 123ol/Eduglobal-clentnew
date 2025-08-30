import { Col, Row, Alert } from 'react-bootstrap';
import CountUp from 'react-countup';
import { FaClipboardCheck, FaMedal, FaTv } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Counter = () => {
  const [counterData, setCounterData] = useState([
    { count: 0, title: 'Total Courses', icon: FaTv, variant: 'orange' },
    { count: 0, title: 'Enrolled Courses', icon: FaMedal, variant: 'success' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get token from cookies
        const cookieValue = Cookies.get('_EduGlobal_AUTH_KEY_');
        console.log('Retrieved cookie value:', cookieValue || 'No cookie found');

        if (!cookieValue) {
          throw new Error('No authentication token found. Please log in.');
        }

        // Parse the cookie value to extract the token
        let token;
        try {
          const parsed = JSON.parse(cookieValue);
          token = parsed.token;
          if (!token) {
            throw new Error('Token not found in cookie data.');
          }
          console.log('Extracted JWT token:', token);
        } catch (parseError) {
          console.error('Error parsing cookie value:', parseError);
          throw new Error('Invalid cookie format. Please log in again.');
        }

        // Set up headers with token
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        console.log('Request headers:', headers);

        // Fetch total courses
        const totalCoursesResponse = await axios.get(
          'https://eduglobal-servernew-1.onrender.com/api/courses',
          { headers }
        );
        console.log('Total courses response:', totalCoursesResponse.data);
        const totalCoursesCount = totalCoursesResponse.data?.totalCourses || totalCoursesResponse.data?.courses?.length || 0;

        // Fetch enrolled courses
        const enrolledCoursesResponse = await axios.get(
          'https://eduglobal-servernew-1.onrender.com/api/courses/user/courses',
          { headers }
        );
        console.log('Enrolled courses response:', enrolledCoursesResponse.data);
        const enrolledCoursesCount = enrolledCoursesResponse.data?.count || 
                                    Array.isArray(enrolledCoursesResponse.data) ? enrolledCoursesResponse.data.length : 
                                    enrolledCoursesResponse.data?.enrolledCourses?.length || 0;

        // Update counterData
        setCounterData([
          { count: totalCoursesCount, title: 'Total Courses', icon: FaTv, variant: 'orange' },
          { count: enrolledCoursesCount, title: 'Enrolled Courses', icon: FaMedal, variant: 'success' },
        ]);
      } catch (error) {
        console.error('Error fetching course data:', error);
        console.log('Error response:', error.response?.data);
        if (error.response?.status === 401) {
          setError('Authentication failed. Please check your login status.');
        } else if (error.response?.status === 500) {
          setError('Server error while fetching enrolled courses. Please try again later.');
        } else {
          setError(error.message || 'Failed to fetch course data. Please try again later.');
        }
        // Update counterData with total courses (if available) and 0 for enrolled courses
        setCounterData((prev) => [
          { ...prev[0] }, // Keep total courses count
          { count: 0, title: 'Enrolled Courses', icon: FaMedal, variant: 'success' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CounterCard = ({ count, title, icon: Icon, suffix, variant }) => {
    return (
      <div className={`d-flex justify-content-center align-items-center p-4 bg-${variant} bg-opacity-15 rounded-3`}>
        <span className={`display-6 text-${variant} mb-0`}>
          {Icon && <Icon size={56} className="fa-fw" />}
        </span>
        <div className="ms-4">
          <div className="d-flex">
            <h5 className="purecounter mb-0 fw-bold">
              <CountUp suffix={suffix} end={count} delay={2} />
            </h5>
          </div>
          <span className="mb-0 h6 fw-light">{title}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {loading && <Alert variant="info">Loading course data...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Row className="mb-4">
          {counterData.map((item, idx) => (
            <Col sm={6} lg={4} className="mb-3" key={idx}>
              <CounterCard {...item} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Counter;