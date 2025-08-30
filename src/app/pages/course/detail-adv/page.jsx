import Footer from '@/components/Footer';
import { useAuthContext } from '@/context/useAuthContext';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'plyr-react/plyr.css';
import Plyr from 'plyr-react';
import Sticky from 'react-sticky-el';
import useToggle from '@/hooks/useToggle';
import { splitArray } from '@/utils/array';
import { currency } from '@/context/constants';
import useViewPort from '@/hooks/useViewPort';
import DOMPurify from "dompurify";
import { useLayoutContext } from '@/context/useLayoutContext';
import avatar5 from '@/assets/images/avatar/05.jpg';
import LogoBox from '@/components/LogoBox';
import TopNavbar from '@/components/TopNavbar';
import AppMenu from '@/components/TopNavbar/components/AppMenu';
import ProfileDropdown from '@/components/TopNavbar/components/ProfileDropdown';
import TopbarMenuToggler from '@/components/TopNavbar/components/TopbarMenuToggler';
import { Button, Card, CardHeader, CardBody, Col, Collapse, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Alert } from 'react-bootstrap';
import { BsLockFill, BsPatchExclamationFill } from 'react-icons/bs';
import { FaAngleDown, FaAngleUp, FaBookOpen, FaCheckCircle, FaClock, FaCopy, FaFacebookSquare, FaGlobe, FaLinkedin, FaMedal, FaPlay, FaRegStar, FaShareAlt, FaSignal, FaStar, FaStarHalfAlt, FaTwitterSquare, FaUserClock, FaUserGraduate } from 'react-icons/fa';

// Custom hook for fetching data
const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loginNotice, setLoginNotice] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
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

  return { data, loading, error, loginNotice, setLoginNotice };
};

// Dummy data for faqsData
const faqsData = [
  {
    question: 'What is digital marketing?',
    answer: 'Digital marketing encompasses all marketing efforts that use an electronic device or the internet.'
  },
  {
    question: 'Why should I take this course?',
    answer: 'This course provides comprehensive knowledge and practical skills in digital marketing.'
  },
];

// --- VideoPlayer
const VideoPlayer = ({ videoFiles = {}, videoURL = "", poster = "" }) => {
  let sources = [];

  if (videoFiles && Object.values(videoFiles).some(src => src)) {
    sources = Object.entries(videoFiles)
      .filter(([_, src]) => src)
      .map(([type, src]) => ({
        src,
        type: `video/${type}`
      }));
  } else if (videoURL) {
    sources = [{ src: videoURL, type: "video/mp4" }];
  } else {
    sources = [
      { src: "/videos/360p.mp4", size: 360 },
      { src: "/videos/720p.mp4", size: 720 },
      { src: "/videos/1080p.mp4", size: 1080 }
    ];
  }

  return (
    <div className="video-player rounded-3">
      <Plyr
        playsInline
        crossOrigin="anonymous"
        controls
        source={{
          type: "video",
          poster: poster,
          sources
        }}
      />
    </div>
  );
};

const CourseDescription = ({ course }) => {
  const { isTrue, toggle } = useToggle();
  const features = course?.features || [
    'Digital marketing course introduction',
    'Customer Life cycle',
    'What is Search engine optimization(SEO)',
    'Facebook ADS',
    'Facebook Messenger Chatbot',
    'Search engine optimization tools',
    'Why SEO',
    'URL Structure',
    'Featured Snippet',
    'SEO tips and tricks',
    'Google tag manager'
  ];
  const featureChunks = splitArray(features, 2);
  return (
    <Card className="border">
      <CardHeader className="border-bottom">
        <h3 className="mb-0">Course description</h3>
      </CardHeader>
      <CardBody>
        <div
          className="fw-light h6"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(course?.description || ""),
          }}
        ></div>
      </CardBody>
    </Card>
  );
};

const Curriculum = ({ lectures = [] }) => {
  const { isTrue: isOpen, toggle } = useToggle();
  const curriculumGroups = splitArray(lectures, Math.ceil(lectures.length / 4) || 1);

  return (
    <Card className="border rounded-3">
      <CardHeader className="border-bottom">
        <h3 className="mb-0">Curriculum</h3>
      </CardHeader>
      <CardBody>
        <Row className="g-5">
          {curriculumGroups.slice(0, 2).map((group, idx) => (
            <Col xs={12} key={idx}>
              <h5 className="mb-4">Section {idx + 1} ({group.length} lectures)</h5>
              {group.map((lecture, lecIdx) => (
                <Fragment key={lecIdx}>
                  <div className="d-sm-flex justify-content-sm-between align-items-center">
                    <div className="d-flex">
                      {lecture.isPremium ? (
                        <Button variant="light" className="btn btn-round mb-0 flex-shrink-0 flex-centered">
                          <BsLockFill size={16} />
                        </Button>
                      ) : (
                        <Button variant="danger-soft" className="btn btn-round mb-0 flex-centered">
                          <FaPlay size={16} />
                        </Button>
                      )}
                      <div className="ms-2 ms-sm-3 mt-1 mt-sm-0">
                        <h6 className="mb-0">{lecture.title || `Lecture ${lecIdx + 1}`}</h6>
                        <p className="mb-2 mb-sm-0 small">{lecture.time || 'N/A'}</p>
                      </div>
                    </div>
                    <Button size="sm" variant={lecture.isPremium ? 'orange' : 'success'} className="mb-0">
                      {lecture.isPremium ? 'Premium' : 'Play'}
                    </Button>
                  </div>
                  {group.length - 1 !== lecIdx && <hr />}
                </Fragment>
              ))}
            </Col>
          ))}
          <Collapse in={isOpen} className="mt-0">
            <div>
              {curriculumGroups.slice(2).map((group, idx) => (
                <Col xs={12} key={idx} className="mt-5">
                  <h5 className="mb-4">Section {idx + 3} ({group.length} lectures)</h5>
                  {group.map((lecture, lecIdx) => (
                    <Fragment key={lecIdx}>
                      <div className="d-sm-flex justify-content-sm-between align-items-center">
                        <div className="d-flex">
                          {lecture.isPremium ? (
                            <Button variant="light" className="btn btn-round mb-0 flex-shrink-0 flex-centered">
                              <BsLockFill size={16} />
                            </Button>
                          ) : (
                            <Button variant="danger-soft" className="btn btn-round mb-0 flex-centered">
                              <FaPlay size={16} />
                            </Button>
                          )}
                          <div className="ms-2 ms-sm-3 mt-1 mt-sm-0">
                            <h6 className="mb-0">{lecture.title || `Lecture ${lecIdx + 1}`}</h6>
                            <p className="mb-2 mb-sm-0 small">{lecture.time || 'N/A'}</p>
                          </div>
                        </div>
                        <Button size="sm" variant={lecture.isPremium ? 'orange' : 'success'} className="mb-0">
                          {lecture.isPremium ? 'Premium' : 'Play'}
                        </Button>
                      </div>
                      {group.length - 1 !== lecIdx && <hr />}
                    </Fragment>
                  ))}
                </Col>
              ))}
            </div>
          </Collapse>
          <a onClick={toggle} className="mb-0 mt-4 btn-more d-flex align-items-center justify-content-center" href="#collapseCourse" role="button" aria-expanded="false" aria-controls="collapseCourse">
            See
            <span className="mx-1">
              {isOpen ? (
                <>
                  less video <FaAngleUp className="ms-1" />
                </>
              ) : (
                <>
                  more video <FaAngleDown className="ms-1" />
                </>
              )}
            </span>
          </a>
        </Row>
      </CardBody>
    </Card>
  );
};

const Faqs = ({ faqs = faqsData }) => {
  return (
    <Card className="border rounded-3">
      <CardHeader className="border-bottom">
        <h3 className="mb-0">Frequently Asked Questions</h3>
      </CardHeader>
      <CardBody>
        {faqs.map((faq, idx) => (
          <div className={`${idx === 0 ? 'mt-0' : 'mt-4'}`} key={idx}>
            <h6>{faq.question}</h6>
            <p className="mb-0">{faq.answer}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

const PriceCard = ({ course, lectures = [] }) => {
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loginNotice, setLoginNotice] = useState(false);
  const { id } = useParams();
  const { user } = useAuthContext();

  const getAuthTokenFromCookie = () => {
    const cookieName = "_EduGlobal_AUTH_KEY_=";
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.startsWith(cookieName)) {
        try {
          const parsed = JSON.parse(decodeURIComponent(c.substring(cookieName.length)));
          return parsed.token;
        } catch (err) {
          console.error("Error parsing auth cookie:", err);
          return null;
        }
      }
    }
    console.warn("Auth cookie not found");
    return null;
  };

  const handleBuyNow = async () => {
    if (!user || !user.email) {
      setLoginNotice(true);
      return;
    }
    setLoginNotice(false);

    try {
      const token = getAuthTokenFromCookie();
      if (!token) {
        setEnrollmentStatus("error");
        setErrorMessage("Authentication token not found. Please log in again.");
        return;
      }

      const enrollResponse = await fetch(
        `https://eduglobal-servernew-1.onrender.com/api/courses/${id}/enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const enrollData = await enrollResponse.json();
      if (enrollResponse.ok) {
        setEnrollmentStatus("success");
        setErrorMessage(null);
      } else {
        setEnrollmentStatus("error");
        if (enrollResponse.status === 401) {
          setErrorMessage("Session expired. Please log in again.");
        } else if (enrollResponse.status === 404) {
          setErrorMessage("Course not found. Please try another course.");
        } else {
          setErrorMessage(enrollData.message || "Failed to enroll in course.");
        }
      }
    } catch (err) {
      console.error("Enrollment Error:", err);
      setEnrollmentStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <Card className="card-body border p-4">
      {loginNotice && (
        <Alert variant="warning" dismissible onClose={() => setLoginNotice(false)}>
          ⚠️ Please login before enrolling in this course.
        </Alert>
      )}
      {enrollmentStatus === "success" && (
        <Alert variant="success">Successfully enrolled in the course!</Alert>
      )}
      {enrollmentStatus === "error" && (
        <Alert variant="danger">{errorMessage}</Alert>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <h3 className="fw-bold mb-0 me-2">
          {currency}{course?.price || 0}
        </h3>
        <Dropdown>
          <DropdownToggle as="a" className="btn btn-sm arrow-none btn-light rounded mb-0 small" role="button" aria-expanded="false">
            <FaShareAlt className="fa-fw" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded">
            <li><DropdownItem href="#"><FaTwitterSquare className="me-2" /> Twitter</DropdownItem></li>
            <li><DropdownItem href="#"><FaFacebookSquare className="me-2" /> Facebook</DropdownItem></li>
            <li><DropdownItem href="#"><FaLinkedin className="me-2" /> LinkedIn</DropdownItem></li>
            <li><DropdownItem href="#"><FaCopy className="me-2" /> Copy link</DropdownItem></li>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="mt-3 d-grid">
        <Button
          variant="success"
          onClick={handleBuyNow}
          disabled={enrollmentStatus === "success"}
        >
          Enroll now
        </Button>
      </div>

      <hr />
      <h5 className="mb-3">This course includes</h5>
      <ul className="list-group list-group-borderless border-0">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <span className="h6 fw-light mb-0"><FaBookOpen className="fa-fw text-primary me-1" /> Lectures</span>
          <span>{lectures.length}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <span className="h6 fw-light mb-0"><FaClock className="fa-fw text-primary me-1" /> Duration</span>
          <span>{course?.courseTime || "N/A"} hours</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <span className="h6 fw-light mb-0"><FaSignal className="fa-fw text-primary me-1" /> Skills</span>
          <span>{course?.level || 'Beginner'}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <span className="h6 fw-light mb-0"><FaGlobe className="fa-fw text-primary me-1" /> Language</span>
          <span>{course?.language || 'English'}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <span className="h6 fw-light mb-0"><FaUserClock className="fa-fw text-primary me-1" /> Deadline</span>
          <span>{course?.deadline ? new Date(course.deadline).toDateString() : 'N/A'}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <span className="h6 fw-light mb-0"><FaMedal className="fa-fw text-primary me-1" /> Certificate</span>
          <span>Yes</span>
        </li>
      </ul>
      <hr />
    </Card>
  );
};

const PopularTags = ({ tags = [] }) => {
  return (
    <Card className="card-body border p-4">
      <h4 className="mb-3">Popular Tags</h4>
      <ul className="list-inline mb-0">
        {tags.length > 0 ? tags.map((tag, idx) => (
          <li className="list-inline-item" key={idx}>
            <Button variant="outline-light" size="sm">
              {tag}
            </Button>
          </li>
        )) : ['blog', 'business', 'theme', 'bootstrap', 'data science', 'web development', 'tips', 'machine learning'].map((tag, idx) => (
          <li className="list-inline-item" key={idx}>
            <Button variant="outline-light" size="sm">
              {tag}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const PricingAndTags = ({ course, lectures = [] }) => {
  const { width } = useViewPort();
  return (
    <Sticky
      disabled={width <= 768}
      topOffset={80}
      bottomOffset={0}
      boundaryElement="div.row"
      hideOnBoundaryHit={false}
      stickyStyle={{ transition: '0.2s all linear' }}
    >
      <Row className="g-4">
        <Col md={6} xl={12}>
          <PriceCard course={course} lectures={lectures} />
        </Col>
        <Col md={6} xl={12}>
          <PopularTags tags={course?.tags || []} />
        </Col>
      </Row>
    </Sticky>
  );
};

const CourseDetails = () => {
  const { id } = useParams();
  const { data: courseData, loading: courseLoading, error: courseError } = useFetchData(`https://eduglobal-servernew-1.onrender.com/api/courses/${id}`);
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await fetch(`https://eduglobal-servernew-1.onrender.com/api/courses/${id}/lectures`);
        if (response.ok) {
          const data = await response.json();
          setLectures(Array.isArray(data) ? data : []);
        } else {
          console.error(`Failed to fetch lectures for course ${id}: ${response.status}`);
          setLectures([]);
        }
      } catch (err) {
        console.error(`Error fetching lectures for course ${id}:`, err);
        setLectures([]);
      }
    };
    if (id) {
      fetchLectures();
    }
  }, [id]);

  if (courseLoading) return <div>Loading course details...</div>;
  if (courseError) return <div>Error: {courseError}</div>;
  if (!courseData) return <div>No course found</div>;

  const course = courseData;

  return (
    <section className="pt-3 pt-xl-5">
      <Container data-sticky-container>
        <Row className="g-4">
          <Col xl={8}>
            <Row className="g-4">
              <Col xs={12}>
                <h2>{course?.title || 'The Complete Digital Marketing Course - 12 Courses in 1'}</h2>
                <Card className="w-100">
                  <CardBody className="p-3 p-sm-4">
                    <p className="fw-light h6 fs-6 fs-sm-5 fs-md-4 text-break">
                      {course?.shortDescription}
                    </p>
                  </CardBody>
                </Card>
                <ul className="list-inline mb-0">
                  <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0">
                    <FaStar className="me-2" />
                    {course?.averageRating || 4.5}/5.0
                  </li>
                  <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0">
                    <FaUserGraduate className="me-2" />
                    {course?.enrolledCount || 12}k Enrolled
                  </li>
                  <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0">
                    <FaSignal className="me-2" />
                    {course?.level || 'All levels'}
                  </li>
                  <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0">
                    <BsPatchExclamationFill className="me-2" />
                    Last updated{" "}
                    {course?.updatedAt
                      ? new Date(course.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "09/2021"}
                  </li>
                  <li className="list-inline-item fw-light h6">
                    <FaGlobe className="me-2" />
                    {course?.language || 'English'}
                  </li>
                </ul>
              </Col>
              <Col xs={12} className="position-relative">
                <VideoPlayer
                  videoFiles={course?.videoFiles}
                  videoURL={course?.videoURL}
                  poster={course?.courseImage}
                />
              </Col>
              <Col xs={12}>
                <CourseDescription course={course} />
              </Col>
              <Col xs={12}>
                <Curriculum lectures={lectures} />
              </Col>
              <Col xs={12}>
                <Faqs faqs={course?.faqs || faqsData} />
              </Col>
            </Row>
          </Col>
          <Col xl={4}>
            <PricingAndTags course={course} lectures={lectures} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

const TopNavigationBar = () => {
  const { appMenuControl } = useLayoutContext();
  return (
    <TopNavbar>
      <Container>
        <LogoBox height={36} width={143} />
        <TopbarMenuToggler />
        <AppMenu mobileMenuOpen={appMenuControl.open} menuClassName="mx-auto" showExtraPages searchInput />
        <ProfileDropdown className="ms-1 ms-lg-0" />
      </Container>
    </TopNavbar>
  );
};

const MainPage = () => {
  return (
    <>
      <TopNavigationBar />
      <CourseDetails />
      <Footer className="bg-light" />
    </>
  );
};

export default MainPage;