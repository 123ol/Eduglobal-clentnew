import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, CardTitle, Col, Container, Row, Button, FormControl, Collapse, Offcanvas, OffcanvasHeader, OffcanvasBody, Form } from 'react-bootstrap';
import { FaRegClock, FaRegHeart, FaRegStar, FaStar, FaStarHalfAlt, FaTable, FaAngleDown, FaAngleUp, FaSearch, FaSlidersH, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PageMetaData from '@/components/PageMetaData';
import TopNavigationBar from './components/TopNavigationBar';

// Inline CSS styles
const styles = `
  .bg-blue { background-color: #007bff; }
  .bg-grad-pink { background: linear-gradient(90deg, #ff6b6b, #ff8e53); }
  .breadcrumb-dark .breadcrumb-item a { color: #fff; }
  .breadcrumb-dark .breadcrumb-item.active { color: #ffffff80; }
  .btn-primary-soft-check { background-color: #e9ecef; }
  .input-borderless .form-control { border: none; }
  .text-orange { color: #f28c38; }
  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .pagination-primary-soft .page-link { color: #007bff; }
  .pagination-primary-soft .page-item.active .page-link { background-color: #007bff; color: #fff; }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Custom hook for toggling state
const useToggle = () => {
  const [isTrue, setIsTrue] = useState(false);
  const toggle = () => setIsTrue(!isTrue);
  return { isTrue, toggle };
};

// Custom hook for viewport width
const useViewPort = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return { width };
};

// Custom hook for fetching data
const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
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

  return { data, error, loading };
};

// Footer Component
const Footer = ({ className }) => (
  <footer className={`py-4 ${className}`}>
    <Container>
      <p className="text-center mb-0">© 2025 Course Platform</p>
    </Container>
  </footer>
);

// CourseCard Component
const CourseCard = ({ course }) => {
  const { courseImage, title, shortDescription, averageRating, courseTime, totalLecture } = course;
  return (
    <Card className="shadow h-100">
      <img src={courseImage} className="card-img-top" alt="course image" />
      <CardBody className="pb-0">
        <div className="d-flex justify-content-between mb-2">
          <span className="badge bg-success bg-opacity-10">
            {course.featured ? 'Featured' : 'Standard'}
          </span>
          <a href="#" className="h6 fw-light mb-0">
            <FaRegHeart />
          </a>
        </div>
        <CardTitle>
          <Link to={`/pages/course/detail-adv/${course._id}`}>{title}</Link>
        </CardTitle>
        <p className="mb-2 text-truncate-2">{shortDescription}</p>
        <ul className="list-inline mb-0">
          {Array(Math.floor(averageRating)).fill(0).map((_star, idx) => (
            <li key={idx} className="list-inline-item me-1 small">
              <FaStar size={14} className="text-warning" />
            </li>
          ))}
          {!Number.isInteger(averageRating) && (
            <li className="list-inline-item me-1 small">
              <FaStarHalfAlt size={14} className="text-warning" />
            </li>
          )}
          {averageRating < 5 &&
            Array(5 - Math.ceil(averageRating)).fill(0).map((_star, idx) => (
              <li key={idx} className="list-inline-item me-1 small">
                <FaRegStar size={14} className="text-warning" />
              </li>
            ))}
          <li className="list-inline-item ms-2 h6 fw-light mb-0">{averageRating}/5.0</li>
        </ul>
      </CardBody>
      <CardFooter className="pt-0 pb-3">
        <hr />
        <div className="d-flex justify-content-between">
          <span className="h6 fw-light mb-0">
            <FaRegClock className="text-danger me-2" />
            {courseTime}h
          </span>
          <span className="h6 fw-light mb-0">
            <FaTable className="text-orange me-2" />
            {totalLecture} lectures
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

// CourseFilter Component
const CourseFilter = ({ categories, tempFilters, setTempFilters }) => {
  const { isTrue, toggle } = useToggle();
  const languages = ['English', 'French', 'Hindi', 'Russian', 'Spanish', 'Bengali', 'Portuguese'];

  return (
    <form>
      {/* Category Filter */}
      <Card className="card-body shadow p-4 mb-4">
        <h4 className="mb-3">Category</h4>
        <Col xs={12}>
          {categories?.map((category) => (
            <div key={category._id} className="d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={tempFilters.categories.includes(category._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTempFilters({
                        ...tempFilters,
                        categories: [...tempFilters.categories, category._id]
                      });
                    } else {
                      setTempFilters({
                        ...tempFilters,
                        categories: tempFilters.categories.filter((id) => id !== category._id)
                      });
                    }
                  }}
                  id={`category-${category._id}`}
                />
                <label className="form-check-label" htmlFor={`category-${category._id}`}>
                  {category.name}
                </label>
              </div>
              <span className="small">({category.courseCount})</span>
            </div>
          ))}
        </Col>
      </Card>

      {/* Price Filter */}
      <Card className="card-body shadow p-4 mb-4">
        <h4 className="mb-3">Price Level</h4>
        <ul className="list-inline mb-0">
          {['All', 'Free', 'Paid'].map((level) => (
            <li key={level} className="list-inline-item">
              <input
                type="radio"
                className="btn-check"
                checked={tempFilters.price === level}
                onChange={() => setTempFilters({ ...tempFilters, price: level })}
                name="price"
                id={`price-${level}`}
              />
              <label className="btn btn-light btn-primary-soft-check" htmlFor={`price-${level}`}>
                {level}
              </label>
            </li>
          ))}
        </ul>
      </Card>

      {/* Skill Filter */}
      <Card className="card-body shadow p-4 mb-4">
        <h4 className="mb-3">Skill Level</h4>
        <ul className="list-inline mb-0">
          {['All levels', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <li key={level} className="list-inline-item mb-2">
              <input
                type="checkbox"
                className="btn-check"
                checked={tempFilters.skills.includes(level)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTempFilters({ ...tempFilters, skills: [...tempFilters.skills, level] });
                  } else {
                    setTempFilters({
                      ...tempFilters,
                      skills: tempFilters.skills.filter((s) => s !== level)
                    });
                  }
                }}
                id={`skill-${level}`}
              />
              <label className="btn btn-light btn-primary-soft-check" htmlFor={`skill-${level}`}>
                {level}
              </label>
            </li>
          ))}
        </ul>
      </Card>

      {/* Language Filter */}
      <Card className="card-body shadow p-4 mb-4">
        <h4 className="mb-3">Language</h4>
        <ul className="list-inline mb-0 g-3">
          {languages.map((lang) => (
            <li className="list-inline-item mb-2" key={lang}>
              <input
                type="checkbox"
                className="btn-check"
                checked={tempFilters.languages.includes(lang)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTempFilters({ ...tempFilters, languages: [...tempFilters.languages, lang] });
                  } else {
                    setTempFilters({
                      ...tempFilters,
                      languages: tempFilters.languages.filter((l) => l !== lang)
                    });
                  }
                }}
                id={`lang-${lang}`}
              />
              <label className="btn btn-light btn-primary-soft-check" htmlFor={`lang-${lang}`}>
                {lang}
              </label>
            </li>
          ))}
        </ul>
      </Card>
    </form>
  );
};
// Pagination Component
const Pagination = ({ totalCourses, coursesPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  return (
    <nav className="mt-4 d-flex justify-content-center" aria-label="navigation">
      <ul className="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
        <li className="page-item mb-0">
          <Link
            className="page-link"
            to="#"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <FaAngleDoubleLeft />
          </Link>
        </li>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page} className={`page-item mb-0 ${currentPage === page ? 'active' : ''}`}>
            <Link className="page-link" to="#" onClick={() => setCurrentPage(page)}>
              {page}
            </Link>
          </li>
        ))}
        <li className="page-item mb-0">
          <Link
            className="page-link"
            to="#"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <FaAngleDoubleRight />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

// Courses Component
const Courses = () => {
  const { isTrue, toggle } = useToggle();
  const { width } = useViewPort();
  const { data: coursesData, error: courseError, loading: courseLoading } =
    useFetchData('http://localhost:5000/api/courses');
  const { data: categories, error: categoryError, loading: categoryLoading } =
    useFetchData('http://localhost:5000/api/categories');

  const courses = Array.isArray(coursesData) ? coursesData : coursesData?.courses || [];
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  // 🔑 filter states
  const [filters, setFilters] = useState({ categories: [], price: 'All', skills: [], languages: [] });
  const [tempFilters, setTempFilters] = useState(filters);

  if (courseLoading || categoryLoading) return <div>Loading...</div>;
  if (courseError || categoryError) return <div>Error: {courseError || categoryError}</div>;

const applyFilters = (course) => {
  // Category filter
  if (filters.categories.length > 0 && !filters.categories.includes(course.category)) {
    return false;
  }

  // Price filter (support both number + pricingModel)
  if (filters.price === "Free" && (course.price > 0 || course.pricingModel === "paid")) return false;
  if (filters.price === "Paid" && (course.price === 0 || course.pricingModel === "free")) return false;

  // Skill filter
  if (filters.skills.length > 0 && !filters.skills.includes(course.level)) {
    return false;
  }

  // Language filter
  if (filters.languages.length > 0 && !filters.languages.includes(course.language)) {
    return false;
  }

  return true;
};

const getCategoryName = (id) => {
  const cat = categories.find((c) => c._id === id);
  return cat ? cat.name : "Unknown";
};


  const filteredCourses = courses.filter(applyFilters);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <section className="py-5">
      <Container>
        <Row>
          <Col lg={8} xl={9}>
            {/* --- search & sort UI stays same --- */}
            <Row className="g-4">
              {currentCourses.map((course) => (
                <Col sm={6} xl={4} key={course._id}>
                  <CourseCard course={course} />
                </Col>
              ))}
            </Row>
            <Col xs={12}>
              <Pagination
                totalCourses={filteredCourses.length}
                coursesPerPage={coursesPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </Col>
          </Col>

          {/* --- Sidebar / Offcanvas with filter --- */}
          <Col lg={4} xl={3}>
            {width >= 992 ? (
              <>
                <CourseFilter categories={categories} tempFilters={tempFilters} setTempFilters={setTempFilters} />
                <div className="d-grid p-2 p-lg-0 text-center">
                  <Button variant="primary" className="mb-0" onClick={() => setFilters(tempFilters)}>
                    Filter Results
                  </Button>
                </div>
              </>
            ) : (
              <Offcanvas placement="end" show={isTrue} onHide={toggle}>
                <OffcanvasHeader className="bg-light" closeButton>
                  <h5 className="offcanvas-title">Advance Filter</h5>
                </OffcanvasHeader>
                <OffcanvasBody>
                  <CourseFilter categories={categories} tempFilters={tempFilters} setTempFilters={setTempFilters} />
                  <div className="d-grid p-2 p-lg-0 text-center">
                    <Button variant="primary" className="mb-0" onClick={() => { setFilters(tempFilters); toggle(); }}>
                      Filter Results
                    </Button>
                  </div>
                </OffcanvasBody>
              </Offcanvas>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

// NewsLetter Component
const NewsLetter = () => (
  <section className="pt-0">
    <Container className="position-relative overflow-hidden">
      <figure className="position-absolute top-50 start-50 translate-middle ms-3">
        <svg>
          <path d="m496 22.999c0 10.493-8.506 18.999-18.999 18.999s-19-8.506-19-18.999 8.507-18.999 19-18.999 18.999 8.506 18.999 18.999z" fill="#fff" fillRule="evenodd" opacity=".502" />
          <path d="m775 102.5c0 5.799-4.701 10.5-10.5 10.5-5.798 0-10.499-4.701-10.499-10.5 0-5.798 4.701-10.499 10.499-10.499 5.799 0 10.5 4.701 10.5 10.499z" fill="#fff" fillRule="evenodd" opacity=".102" />
          <path d="m192 102c0 6.626-5.373 11.999-12 11.999s-11.999-5.373-11.999-11.999c0-6.628 5.372-12 11.999-12s12 5.372 12 12z" fill="#fff" fillRule="evenodd" opacity=".2" />
          <path d="m20.499 10.25c0 5.66-4.589 10.249-10.25 10.249-5.66 0-10.249-4.589-10.249-10.249-0-5.661 4.589-10.25 10.249-10.25 5.661-0 10.25 4.589 10.25 10.25z" fill="#fff" fillRule="evenodd" opacity=".2" />
        </svg>
      </figure>
      <figure className="position-absolute bottom-0 end-0 mb-5 d-none d-sm-block">
        <svg className="rotate-130" width="258.7px" height="86.9px" viewBox="0 0 258.7 86.9">
          <path stroke="white" fill="none" strokeWidth={2} d="M0,7.2c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5 c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5c16,0,16,25.5,31.9,25.5s16-25.5,31.9-25.5" />
          <path stroke="white" fill="none" strokeWidth={2} d="M0,57c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5 c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5c16,0,16,25.5,31.9,25.5s16-25.5,31.9-25.5" />
        </svg>
      </figure>
      <div className="bg-grad-pink p-3 p-sm-5 rounded-3">
        <Row className="justify-content-center position-relative">
          <figure className="fill-white opacity-1 position-absolute top-50 start-0 translate-middle-y">
            <svg width="141px" height="141px">
              <path d="M140.520,70.258 C140.520,109.064 109.062,140.519 70.258,140.519 C31.454,140.519 -0.004,109.064 -0.004,70.258 C-0.004,31.455 31.454,-0.003 70.258,-0.003 C109.062,-0.003 140.520,31.455 140.520,70.258 Z" />
            </svg>
          </figure>
          <Col xs={12} className="position-relative my-2 my-sm-3">
            <Row className="align-items-center">
              <Col lg={6}>
                <h3 className="text-white mb-3 mb-lg-0">Are you ready for a more great Conversation?</h3>
              </Col>
              <Col lg={6} className="text-lg-end">
                <form className="bg-body rounded p-2">
                  <div className="input-group">
                    <FormControl className="border-0 me-1" type="email" placeholder="Type your email here" />
                    <Button variant="dark" type="button" className="mb-0 rounded">
                      Subscribe
                    </Button>
                  </div>
                </form>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Container>
  </section>
);

// PageBanner Component
const PageBanner = () => (
  <section className="bg-blue align-items-center d-flex" style={{
    background: `url('https://via.placeholder.com/1200x300?text=Pattern') no-repeat center center`,
    backgroundSize: 'cover'
  }}>
    <Container>
      <Row>
        <Col xs={12} className="text-center">
          <h1 className="text-white">Course Grid Classic</h1>
          <div className="d-flex justify-content-center">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-dark breadcrumb-dots mb-0">
                <li className="breadcrumb-item">
                  <Link to="#">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Courses classic
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);

// CourseGrid Component
const CourseGrid = () => (
  <>
    <PageMetaData title="Course Grid" />
    <TopNavigationBar />
    <main>
      <PageBanner />
      <Courses />
      <NewsLetter />
      <Footer className="bg-light" />
    </main>
  </>
);

export default CourseGrid;