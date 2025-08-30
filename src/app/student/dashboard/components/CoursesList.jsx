import { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, Col, Row, Alert } from 'react-bootstrap';
import { BsArrowRepeat, BsCheck, BsPlayCircle } from 'react-icons/bs';
import { FaAngleLeft, FaAngleRight, FaSearch } from 'react-icons/fa';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
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
          'Content-Type': 'application/json',
        };
        console.log('Request headers:', headers);

        // Fetch enrolled courses
        const response = await axios.get(
          'https://eduglobal-servernew-1.onrender.com/api/courses/user/courses',
          { headers }
        );
        console.log('Enrolled courses response:', response.data);

        // Handle single object or array response
        const coursesData = Array.isArray(response.data)
          ? response.data
          : response.data.courses || response.data.enrolledCourses || [response.data];

        // Fetch topic details for each lecture to calculate progress
        const formattedCourses = await Promise.all(
          coursesData.map(async (course) => {
            const lectures = course.lectures || [];
            let totalTopics = 0;
            let completedTopics = 0;

            // Fetch topics for each lecture
            const lecturesWithTopics = await Promise.all(
              lectures.map(async (lecture) => {
                try {
                  const topicsResponse = await axios.get(
                    `https://eduglobal-servernew-1.onrender.com/api/lectures/${lecture._id}/topics`,
                    { headers }
                  );
                  console.log(`Topic API response for lecture ${lecture._id}:`, topicsResponse.data);

                  const topics = topicsResponse.data || [];
                  totalTopics += topics.length;
                  completedTopics += topics.filter((topic) => topic.completed).length;

                  return {
                    _id: lecture._id,
                    title: lecture.title || 'Untitled Lecture',
                    topics: topics.map((topic) => ({
                      id: topic._id,
                      completed: topic.completed || false,
                    })),
                  };
                } catch (topicError) {
                  console.error(`Error fetching topics for lecture ${lecture._id}:`, topicError);
                  return {
                    _id: lecture._id,
                    title: lecture.title || 'Untitled Lecture',
                    topics: [],
                  };
                }
              })
            );

            return {
              title: course.title || 'Untitled Course',
              image: course.courseImage || 'https://via.placeholder.com/100',
              lectures: lecturesWithTopics.length,
              totalTopics,
              completedTopics,
              courseTime: course.courseTime || 'N/A',
              level: course.level || 'Beginner',
            };
          })
        );

        setCourses(formattedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        console.log('Error response:', error.response?.data);
        if (error.response?.status === 401) {
          setError('Authentication failed. Please check your login status.');
        } else if (error.response?.status === 500) {
          setError('Server error while fetching courses. Please try again later.');
        } else {
          setError(error.message || 'Failed to fetch courses. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <Alert variant="info">Loading courses...</Alert>;
  if (error) {
    return (
      <Alert variant="danger">
        {error}
        {error.includes('Authentication failed') && (
          <div>
            <Button onClick={() => window.location.href = '/login'} className="mt-2">
              Go to Login
            </Button>
          </div>
        )}
      </Alert>
    );
  }

  return (
    <Card className="bg-transparent border rounded-3">
      <CardHeader className="bg-transparent border-bottom">
        <h3 className="mb-0">My Courses List</h3>
      </CardHeader>
      <CardBody>
        <Row className="g-3 align-items-center justify-content-between mb-4">
          <Col md={8}>
            <form className="rounded position-relative">
              <input className="form-control pe-5 bg-transparent" type="search" placeholder="Search" aria-label="Search" />
              <button className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset" type="submit">
                <FaSearch />
              </button>
            </form>
          </Col>
          <Col md={3}>
            <form>
              <ChoicesFormInput className="form-select js-choice border-0 z-index-9 bg-transparent" aria-label=".form-select-sm">
                <option>Sort by</option>
                <option>Free</option>
                <option>Newest</option>
                <option>Most popular</option>
                <option>Most Viewed</option>
              </ChoicesFormInput>
            </form>
          </Col>
        </Row>
        <div className="table-responsive border-0">
          <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
            <thead>
              <tr>
                <th scope="col" className="border-0 rounded-start">
                  Course Title
                </th>
                <th scope="col" className="border-0">
                  Total Topics
                </th>
                <th scope="col" className="border-0">
                  Completed Topics
                </th>
                <th scope="col" className="border-0 rounded-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="w-100px">
                        <img src={course.image} className="rounded" alt="course" />
                      </div>
                      <div className="mb-0 ms-2">
                        <h6>
                          <a href="#">{course.title}</a>
                        </h6>
                        <div className="overflow-hidden">
                          <h6 className="mb-0 text-end">
                            {course.totalTopics > 0 ? Math.round((course.completedTopics / course.totalTopics) * 100) : 0}%
                          </h6>
                          <div className="progress progress-sm bg-primary bg-opacity-10">
                            <div
                              className="progress-bar bg-primary aos"
                              role="progressbar"
                              data-aos="slide-right"
                              data-aos-delay={200}
                              data-aos-duration={1000}
                              data-aos-easing="ease-in-out"
                              style={{
                                width: `${course.totalTopics > 0 ? (course.completedTopics / course.totalTopics) * 100 : 0}%`
                              }}
                              aria-valuenow={course.totalTopics > 0 ? (course.completedTopics / course.totalTopics) * 100 : 0}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{course.totalTopics}</td>
                  <td>{course.completedTopics}</td>
                  <td>
                    {course.completedTopics === course.totalTopics && course.totalTopics > 0 ? (
                     
                        <button className="btn btn-sm btn-success me-1 mb-1 mb-md-0 disabled">
                          <BsCheck className="me-1 icons-center" />
                          Complete
                        </button>
                        
                    
                    ) : (
                      <Link to='/student/course-resume'>
          <Button variant="primary-soft" size="sm" className="me-1 mb-1 mb-md-0 icons-center">
            <BsPlayCircle className="me-1" />
            Continue
          </Button></Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
          <p className="mb-0 text-center text-sm-start">Showing 1 to {courses.length} of {courses.length} entries</p>
          <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
            <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
              <li className="page-item mb-0">
                <a className="page-link" href="#" tabIndex={-1}>
                  <FaAngleLeft className="icons-center" />
                </a>
              </li>
              <li className="page-item mb-0 active">
                <a className="page-link" href="#">1</a>
              </li>
              <li className="page-item mb-0">
                <a className="page-link" href="#">
                  <FaAngleRight className="icons-center" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </CardBody>
    </Card>
  );
};

export default CoursesList;