import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardFooter, CardTitle, Col, Container, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { FaHeart, FaRegClock, FaRegHeart, FaRegStar, FaStar, FaStarHalfAlt, FaTable } from 'react-icons/fa';
import useToggle from '@/hooks/useToggle';

// Custom hook for fetching data
const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};

// CourseCard component with mapped fields
const CourseCard = ({ course }) => {
  const { isTrue: isOpen, toggle } = useToggle();
  const {
    badge = { text: course.categoryName || 'Unknown', class: 'bg-primary' },
    description = course.shortDescription || course.description || 'No description available',
    duration = course.courseTime || 'N/A',
    image = course.courseImage || 'https://via.placeholder.com/150',
    lectures = course.lectureCount || 0,
    rating = { star: course.averageRating || 0 },
    title = course.title || 'Untitled Course',
    level = course.level || 'Unknown'
  } = course;

  console.log(`CourseCard for ${course.title}: lectures =`, lectures);

  return (
    <Card className="shadow h-100">
      <img src={image} className="card-img-top" alt="course image" />
      <CardBody className="pb-0">
        <div className="d-flex justify-content-between mb-2">
          <a href="#" className={clsx('badge bg-opacity-10', badge.class)}>
            {badge.text}
          </a>
          <span role="button" className="h6 mb-0" onClick={toggle}>
            {isOpen ? <FaHeart fill="red" /> : <FaRegHeart />}
          </span>
        </div>
        <CardTitle className="fw-normal">
          <Link to={`/pages/course/detail-adv/${course._id}`}>{title}</Link>
        </CardTitle>
        <p className="mb-2 text-truncate-2">{description}</p>
        <p className="mb-2"><strong>Level:</strong> {level}</p>
        {rating && (
          <ul className="list-inline mb-0">
            {Array(Math.floor(rating.star)).fill(0).map((_star, idx) => (
              <li key={idx} className="list-inline-item me-1 small">
                <FaStar className="text-warning" />
              </li>
            ))}
            {!Number.isInteger(rating.star) && (
              <li className="list-inline-item me-1 small">
                <FaStarHalfAlt className="text-warning" />
              </li>
            )}
            {rating.star < 5 &&
              Array(5 - Math.ceil(rating.star)).fill(0).map((_star, idx) => (
                <li key={idx} className="list-inline-item me-1 small">
                  <FaRegStar className="text-warning" />
                </li>
              ))}
            <li className="list-inline-item ms-2 h6 fw-light mb-0">{rating.star}/5.0</li>
          </ul>
        )}
      </CardBody>
      <CardFooter className="pt-0 pb-3">
        <hr />
        <div className="d-flex justify-content-between">
          <span className="h6 fw-light mb-0">
            <FaRegClock className="text-danger me-2" />
            {duration}
          </span>
          <span className="h6 fw-light mb-0">
            <FaTable className="text-orange me-2" />
            {lectures} lectures
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

// Courses component
const Courses = ({ courseKey, courses, categoriesData }) => {
  console.log('Courses data in Courses component:', courses);
  console.log('Filtering courses for courseKey:', courseKey);

  // Find the category ID corresponding to the courseKey (category name)
  const category = categoriesData?.find(
    (cat) => cat.name.toLowerCase() === courseKey.toLowerCase()
  );
  const categoryId = category?._id || '';

  const filteredCourses = Array.isArray(courses)
    ? courses.filter((course) => course.category === categoryId)
    : [];

  console.log('Category ID for filtering:', categoryId);
  console.log('Filtered courses:', filteredCourses);

  // ✅ Limit to max 6 courses
  const limitedCourses = filteredCourses.slice(0, 6);

  return (
    <TabPane eventKey={courseKey} className="fade show" role="tabpanel">
      <Row className="g-4">
        {limitedCourses.length > 0 ? (
          limitedCourses.map((course, idx) => (
            <Col sm={6} lg={4} xl={3} key={idx}>
              <CourseCard course={{ ...course, categoryName: courseKey }} />
            </Col>
          ))
        ) : (
          <Col>
            <p>No courses available for this category.</p>
          </Col>
        )}
      </Row>
    </TabPane>
  );
};

// PopularCourse component
const PopularCourse = () => {
  const { data: categoriesData, loading: catLoading, error: catError } = useFetchData('https://eduglobal-servernew-1.onrender.com/api/categories');
  const { data: coursesData, loading: courseLoading, error: courseError } = useFetchData('http://localhost:5000/api/courses');

  // State for lecture counts
  const [lectureCounts, setLectureCounts] = useState({});

  // Fetch lecture counts for each course
  useEffect(() => {
    const fetchLectureCounts = async () => {
      if (coursesData?.courses && Array.isArray(coursesData.courses)) {
        const counts = {};
        for (const course of coursesData.courses) {
          try {
            const response = await fetch(`http://localhost:5000/api/courses/${course._id}/lectures`);
            if (response.ok) {
              const data = await response.json();
              console.log(`Lecture data for course ${course._id}:`, data);
              counts[course._id] = Array.isArray(data) ? data.length : data.count || 0;
            } else {
              console.error(`Failed to fetch lectures for course ${course._id}: ${response.status}`);
              counts[course._id] = 0;
            }
          } catch (err) {
            console.error(`Error fetching lectures for course ${course._id}:`, err);
            counts[course._id] = 0;
          }
        }
        setLectureCounts(counts);
      }
    };
    fetchLectureCounts();
  }, [coursesData]);

  // Normalize courses data with lecture counts
  const courses = coursesData?.courses && Array.isArray(coursesData.courses)
    ? coursesData.courses.map(course => ({
        ...course,
        lectureCount: lectureCounts[course._id] !== undefined ? lectureCounts[course._id] : course.totalLecture || 0
      }))
    : [];

  // Normalize categories to an array of strings
  const normalizeCategory = (category) => {
    if (typeof category === 'string') return category;
    if (category && typeof category === 'object') {
      return category.name || category.category || category.id || JSON.stringify(category);
    }
    return 'Unknown';
  };

  // Use categories from API if available, else derive from courses
  const selectedCategories = categoriesData && Array.isArray(categoriesData)
    ? categoriesData.slice(0, 5).map(normalizeCategory)
    : Array.isArray(courses)
      ? [...new Set(courses.map(course => course.category || 'Unknown'))].slice(0, 5)
      : [];

  console.log('Categories data:', categoriesData);
  console.log('Courses data:', coursesData);
  console.log('Selected categories:', selectedCategories);
  console.log('Course categories:', courses.map(course => course.category));
  console.log('Lecture counts:', lectureCounts);

  if (catLoading || courseLoading) return <div>Loading...</div>;
  if (courseError) return <div>Error: {courseError}</div>;
  if (!courses.length) return <div>No courses available</div>;
  if (!selectedCategories.length) return <div>No categories available</div>;

  return (
    <section>
      <Container>
        <Row className="mb-4">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="fs-1">Most Popular Courses</h2>
            <p className="mb-0">Choose from hundreds of courses from specialist organizations</p>
          </Col>
        </Row>
        <TabContainer defaultActiveKey={selectedCategories[0] || 'default'}>
          <Nav className="nav-pills nav-pills-bg-soft justify-content-sm-center mb-4 px-3" role="tablist">
            {selectedCategories.map((category, idx) => (
              <NavItem key={idx} className="me-2 me-sm-5">
                <NavLink as="button" eventKey={category} className="mb-2 mb-md-0" type="button" role="tab">
                  {category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent>
            {selectedCategories.map((category, idx) => (
              <Courses courseKey={category} courses={courses} categoriesData={categoriesData} key={idx} />
            ))}
          </TabContent>
        </TabContainer>
      </Container>
    </section>
  );
};

export default PopularCourse;