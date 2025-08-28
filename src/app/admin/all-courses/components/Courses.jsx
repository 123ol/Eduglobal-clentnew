import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight, FaSearch, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const placeholderImg = "https://via.placeholder.com/150x100?text=No+Image";

// Helper to read cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Format date safely
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
};

// Single course row
const CourseCard = ({ image, title, date, price, status, badge, onDelete }) => {
  return (
    <tr>
      <td>
        <div className="d-flex align-items-center position-relative">
          <div className="w-60px">
            <img
              src={image || placeholderImg}
              className="rounded"
              alt={title}
              style={{ width: "60px", height: "40px", objectFit: "cover" }}
            />
          </div>
          <h6 className="table-responsive-title mb-0 ms-2">
            <Link to="#" className="stretched-link">
              {title}
            </Link>
          </h6>
        </div>
      </td>
      <td>{formatDate(date)}</td>
      <td>
        <span
          className={`badge text-bg-${
            badge?.text === "Beginner"
              ? "primary"
              : badge?.text === "All Level"
              ? "orange"
              : "purple"
          }`}
        >
          {badge?.text || "N/A"}
        </span>
      </td>
      <td>{price ? `N${price}` : "Free"}</td>
      <td>
        <span
          className={`badge text-${
            status === "pending" ? "warning" : "success"
          } bg-${status === "pending" ? "warning" : "success"} bg-opacity-15 `}
        >
          {status}
        </span>
      </td>
      <td>
        {status === "pending" ? (
          <>
            <Button variant="success-soft" size="sm" className="me-1 mb-1 mb-md-0">
              Approve
            </Button>
            <Button
              variant="danger-soft"
              size="sm"
              className="me-1 mb-1 mb-md-0"
              onClick={onDelete}
              title="Delete Course"
            >
              <FaTrash />
            </Button>
            <Button variant="secondary-soft" size="sm" className="mb-0">
              Reject
            </Button>
          </>
        ) : (
          <>
            <Button variant="dark" size="sm" className="me-1 mb-1 mb-md-0">
              Edit
            </Button>
            <Button
              variant="danger-soft"
              size="sm"
              className="me-1 mb-1 mb-md-0"
              onClick={onDelete}
              title="Delete Course"
            >
              <FaTrash />
            </Button>
          </>
        )}
      </td>
    </tr>
  );
};

// Courses main component
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  // Get token from cookie
  const getAuthToken = () => {
    const cookieData = getCookie("_EduGlobal_AUTH_KEY_");
    if (!cookieData) return null;
    try {
      const parsed = JSON.parse(decodeURIComponent(cookieData));
      return parsed.token || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = getAuthToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const { data } = await axios.get(
          'https://eduglobal-servernew-1.onrender.com/api/courses',
          config
        );
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        if (error.response?.status === 401) {
          alert("Unauthorized: Please log in to fetch courses.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Delete course function
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please log in to perform this action.");
        return;
      }

      await axios.delete(
        `https://eduglobal-servernew-1.onrender.com/api/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourses(courses.filter((course) => course._id !== courseId));
      console.log(`Course ${courseId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting course:', error);
      if (error.response?.status === 401) {
        alert("Unauthorized: Please log in or check your credentials.");
      } else {
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  // Filter courses by search query
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOption === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOption === "Accepted") return a.status === "accepted" ? -1 : 1;
    if (sortOption === "Rejected") return a.status === "rejected" ? -1 : 1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = sortedCourses.slice(startIndex, startIndex + coursesPerPage);

  return (
    <Card className="bg-transparent border">
      <CardHeader className="bg-light border-bottom">
        <Row className="g-3 align-items-center justify-content-between">
          <Col md={8}>
            <form className="rounded position-relative" onSubmit={(e) => e.preventDefault()}>
              <input
                className="form-control bg-body"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button
                className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                type="submit"
              >
                <FaSearch />
              </button>
            </form>
          </Col>
          <Col md={3}>
            <ChoicesFormInput
              className="form-select js-choice border-0 z-index-9"
              aria-label=".form-select-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </ChoicesFormInput>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="table-responsive border-0 rounded-3">
            <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Added Date</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.length > 0 ? (
                  currentCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      image={course.courseImage}
                      title={course.title}
                      date={course.createdAt}
                      price={course.price}
                      status={course.status || "pending"}
                      badge={{ text: course.level }}
                      onDelete={() => handleDeleteCourse(course._id)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">No courses found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
      <CardFooter className="bg-transparent pt-0">
        <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
          <p className="mb-0 text-center text-sm-start">
            Showing {startIndex + 1} to {Math.min(startIndex + coursesPerPage, sortedCourses.length)} of {sortedCourses.length} entries
          </p>
          <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
            <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
              <li className={`page-item mb-0 ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                  <FaAngleLeft />
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, idx) => (
                <li key={idx} className={`page-item mb-0 ${currentPage === idx + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item mb-0 ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                  <FaAngleRight />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Courses;
