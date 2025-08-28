import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const placeholderImg = "https://via.placeholder.com/150x100?text=No+Image";

// ✅ Format date safely
// ✅ Format date safely
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
};


// ✅ Single course row
const CourseCard = ({ image, title, date, price, status, badge }) => {
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

      {status === "pending" ? (
        <td>
          <Button variant="success-soft" size="sm" className="me-1 mb-1 mb-md-0">
            Approve
          </Button>
          <button className="btn btn-sm btn-secondary-soft mb-0">Reject</button>
        </td>
      ) : (
        <td>
          <Button variant="dark" size="sm" className="me-1 mb-1 mb-md-0">
            Edit
          </Button>
        </td>
      )}
    </tr>
  );
};

// ✅ Courses main component
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest"); // 👈 sort
  const [currentPage, setCurrentPage] = useState(1); // 👈 pagination
  const coursesPerPage = 5;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/courses');
        console.log("Backend response:", data);
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ✅ Filter courses by search query
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOption === "Newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOption === "Oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortOption === "Accepted") {
      return (a.status === "accepted" ? -1 : 1);
    }
    if (sortOption === "Rejected") {
      return (a.status === "rejected" ? -1 : 1);
    }
    return 0;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = sortedCourses.slice(startIndex, startIndex + coursesPerPage);

  return (
    <Card className="bg-transparent border">
      <CardHeader className="bg-light border-bottom">
        <Row className="g-3 align-items-center justify-content-between">
          <Col md={8}>
            <form
              className="rounded position-relative"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="form-control bg-body"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // reset page
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
            <form>
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
            </form>
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
                  <th scope="col">Course Name</th>
                  <th scope="col">Added Date</th>
                  <th scope="col">Type</th>
                  <th scope="col">Price</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
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
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No courses found
                    </td>
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
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + coursesPerPage, sortedCourses.length)} of{" "}
            {sortedCourses.length} entries
          </p>
          <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
            <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
              <li className={`page-item mb-0 ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
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
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
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
