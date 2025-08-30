import { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Alert, Modal } from 'react-bootstrap';
import { BsLockFill, BsPencilSquare, BsPlayFill, BsTrashFill } from 'react-icons/bs';
import { FaPlay, FaRegClock, FaSignal, FaTable, FaPlayCircle, FaFilePdf, FaCheckCircle } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';

const CourseNote = ({ lecture }) => {
  return (
    <>
      <a className="btn btn-xs btn-warning mb-0" data-bs-toggle="collapse" href={`#addnote-${lecture._id}`} role="button" aria-expanded="false" aria-controls={`addnote-${lecture._id}`}>
        <BsPencilSquare className="me-2" />
        Note
      </a>
      &nbsp;
      <a href="#" className="btn btn-xs btn-dark mb-0">
        Play again
      </a>
      <div className="collapse" id={`addnote-${lecture._id}`}>
        <Card className="card-body p-0 mt-2">
          <div className="d-flex justify-content-between bg-light rounded-2 p-2 mb-2">
            <div className="d-flex align-items-center">
              <span className="badge bg-dark me-2">5:20</span>
              <h6 className="d-inline-block text-truncate w-100px w-sm-200px mb-0 fw-light">Describe SEO Engine</h6>
            </div>
            <div className="d-flex">
              <Button variant="light" size="sm" className="btn-round me-2 mb-0">
                <BsPlayFill />
              </Button>
              <Button variant="light" size="sm" className="btn-round mb-0">
                <BsTrashFill />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

const CourseResumeCard = ({ lectures, course }) => {
  const [showVideo, setShowVideo] = useState(null);
  const [completedTopics, setCompletedTopics] = useState({});
  const videoRef = useRef(null);

  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
  };

  const markTopicAsComplete = async (lectureId, topicId) => {
    try {
      const cookieValue = Cookies.get('_EduGlobal_AUTH_KEY_');
      if (!cookieValue) throw new Error('No authentication token found');
      const { token } = JSON.parse(cookieValue);
      await axios.post(
        `https://eduglobal-servernew-1.onrender.com/api/lectures/${lectureId}/topics/${topicId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setCompletedTopics((prev) => ({ ...prev, [topicId]: true }));
    } catch (error) {
      console.error('Error marking topic as complete:', error);
    }
  };

  const handleVideoClick = (url, lectureId, topicId) => {
    setShowVideo({ url, lectureId, topicId });
  };

  const handleCloseVideo = () => {
    setShowVideo(null);
    if (videoRef.current) videoRef.current = null;
  };

  const handleVideoEnded = (lectureId, topicId) => {
    markTopicAsComplete(lectureId, topicId);
  };

  const handlePdfClick = (lectureId, topicId) => {
    markTopicAsComplete(lectureId, topicId);
  };

  return (
    <Card className="border">
      <CardHeader className="border-bottom">
        <Card>
          <Row className="g-0">
            <Col md={3}>
              {course?.image && (
                <img
                  src={course.image}
                  className="rounded-2"
                  alt="Course image"
                  onError={(e) => {
                    console.error('Image failed to load:', course.image);
                    e.target.src = 'https://via.placeholder.com/100';
                  }}
                />
              )}
            </Col>
            <Col md={9}>
              <CardBody>
                <CardTitle as="h3">
                  <a href="#">{course?.name}</a>
                </CardTitle>
                <ul className="list-inline mb-2">
                  <li className="list-inline-item h6 fw-light mb-1 mb-sm-0 icons-center">
                    <FaRegClock className="text-danger me-2" />
                    {course?.courseTime || 'N/A'}
                  </li>
                  <li className="list-inline-item h6 fw-light mb-1 mb-sm-0 icons-center">
                    <FaTable className="text-orange me-2" />
                    {course?.totalLectures} lectures
                  </li>
                  <li className="list-inline-item h6 fw-light icons-center">
                    <FaSignal className="text-success me-2" />
                    {course?.level || 'Beginner'}
                  </li>
                </ul>
                <Button variant="primary-soft" size="sm" className="mb-0">
                  Resume course
                </Button>
              </CardBody>
            </Col>
          </Row>
        </Card>
      </CardHeader>
      <CardBody>
        <h5>Course Lectures</h5>
        <Accordion className="accordion-icon accordion-bg-light" id={`accordion-${course._id}`}>
          {lectures.map((lecture, idx) => {
            const completedCount = lecture.topics.filter((topic) => completedTopics[topic.id] || topic.completed).length;
            const totalTopics = lecture.topics.length;
            const progressPercentage = totalTopics > 0 ? Math.trunc((completedCount / totalTopics) * 100) : 0;

            return (
              <AccordionItem eventKey={`${idx}`} className="mb-3" key={idx}>
                <AccordionHeader className="font-base" id={`heading-${idx}-${course._id}`}>
                  <div className="fw-bold rounded collapsed d-block pe-4">
                    <span className="mb-0">{lecture.title}</span>
                    <span className="small d-block mt-1">
                      ({lecture.topics.length} Topic{lecture.topics.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                </AccordionHeader>
                <AccordionBody className="mt-3">
                  <div className="vstack gap-3">
                    <div className="overflow-hidden">
                      <div className="d-flex justify-content-between">
                        <p className="mb-1 h6">{completedCount}/{totalTopics} Completed</p>
                        <h6 className="mb-1 text-end">{progressPercentage}%</h6>
                      </div>
                      <div className="progress progress-sm bg-primary bg-opacity-10">
                        <div
                          className="progress-bar bg-primary aos"
                          role="progressbar"
                          data-aos="slide-right"
                          data-aos-delay={200}
                          data-aos-duration={1000}
                          data-aos-easing="ease-in-out"
                          style={{ width: `${progressPercentage}%` }}
                          aria-valuenow={progressPercentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </div>
                    {lecture.topics?.length > 0 && (
                      <ul className="list-group list-group-flush mb-2">
                        {lecture.topics.map((topic, topicIdx) => (
                          <li key={topicIdx} className="list-group-item d-flex align-items-center">
                            {lecture.isPremium ? (
                              <a href="#" className="btn btn-light btn-round btn-sm mb-0 stretched-link position-static me-2">
                                <BsLockFill className="me-0" />
                              </a>
                            ) : (
                              <Button
                                variant={completedTopics[topic.id] || topic.completed ? 'success' : 'danger-soft'}
                                size="sm"
                                className="btn-round mb-0 stretched-link position-static me-2"
                                onClick={() => topic.type === 'video' && handleVideoClick(topic.url, lecture._id, topic.id)}
                                disabled={topic.type === 'pdf' || !topic.url}
                              >
                                {completedTopics[topic.id] || topic.completed ? (
                                  <FaCheckCircle className="me-0" size={11} />
                                ) : topic.type === 'video' ? (
                                  <FaPlayCircle className="me-0" size={11} />
                                ) : topic.type === 'pdf' ? (
                                  <FaFilePdf className="me-0" size={11} />
                                ) : (
                                  <FaPlay className="me-0" size={11} />
                                )}
                              </Button>
                            )}
                            {topic.type === 'video' ? (
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!lecture.isPremium) handleVideoClick(topic.url, lecture._id, topic.id);
                                }}
                                className="text-decoration-none"
                              >
                                {topic.name || `Topic ID: ${topic.id}`}
                              </a>
                            ) : topic.type === 'pdf' ? (
                              <a
                                href={topic.url}
                                download={topic.name || `topic-${topic.id}.pdf`}
                                className="text-decoration-none"
                                onClick={(e) => {
                                  if (lecture.isPremium) e.preventDefault();
                                  else handlePdfClick(lecture._id, topic.id);
                                }}
                              >
                                {topic.name || `Topic ID: ${topic.id}`}
                              </a>
                            ) : (
                              <small>{topic.name || `Topic ID: ${topic.id}`}</small>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {lecture.isNote && <CourseNote lecture={lecture} />}
                  </div>
                </AccordionBody>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardBody>
      <Modal show={!!showVideo} onHide={handleCloseVideo} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Video Player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showVideo && (
            isYouTubeUrl(showVideo.url) ? (
              <iframe
                width="100%"
                height="400"
                src={getYouTubeEmbedUrl(showVideo.url)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                ref={videoRef}
                controls
                autoPlay
                style={{ width: '100%' }}
                onEnded={() => handleVideoEnded(showVideo.lectureId, showVideo.topicId)}
              >
                <source src={showVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

const MarketingCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const cookieValue = Cookies.get('_EduGlobal_AUTH_KEY_');
        if (!cookieValue) {
          throw new Error('No authentication token found. Please log in.');
        }

        let token;
        try {
          const parsed = JSON.parse(cookieValue);
          token = parsed.token;
          if (!token) {
            throw new Error('Token not found in cookie data.');
          }
        } catch (parseError) {
          console.error('Error parsing cookie value:', parseError);
          throw new Error('Invalid cookie format. Please log in again.');
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Fetch courses
        const coursesResponse = await axios.get(
          'https://eduglobal-servernew-1.onrender.com/api/courses/user/courses',
          { headers }
        );

        const coursesData = Array.isArray(coursesResponse.data)
          ? coursesResponse.data
          : coursesResponse.data.courses || coursesResponse.data.enrolledCourses || [coursesResponse.data];

        // Fetch topic details for each lecture
        const formattedCourses = await Promise.all(
          coursesData.map(async (course) => {
            const lectures = course.lectures || [];
            // Fetch topics for each lecture
            const lecturesWithTopics = await Promise.all(
              lectures.map(async (lecture) => {
                try {
                  const topicsResponse = await axios.get(
                    `https://eduglobal-servernew-1.onrender.com/api/lectures/${lecture._id}/topics`,
                    { headers }
                  );
                  // Console log the topic API response for inspection
                  console.log(`Topic API response for lecture ${lecture._id}:`, topicsResponse.data);

                  const topicsData = topicsResponse.data || [];
                  // Map topic IDs to objects with id, name, type, url, and completed
                  const topics = lecture.topics.map((topicId) => {
                    const topic = topicsData.find((t) => t._id === topicId);
                    return {
                      id: topicId,
                      name: topic?.name || 'Unnamed Topic',
                      type: topic?.resourceType || 'unknown',
                      url: topic?.resourceLink || '',
                      completed: topic?.completed || false,
                    };
                  });
                  return {
                    _id: lecture._id,
                    title: lecture.title || 'Untitled Lecture',
                    time: lecture.time || 'N/A',
                    isPremium: lecture.isPremium || false,
                    isNote: lecture.isNote || false,
                    completed: lecture.completed || false,
                    topics,
                  };
                } catch (topicError) {
                  console.error(`Error fetching topics for lecture ${lecture._id}:`, topicError);
                  // Fallback to original topic IDs if fetching fails
                  return {
                    _id: lecture._id,
                    title: lecture.title || 'Untitled Lecture',
                    time: lecture.time || 'N/A',
                    isPremium: lecture.isPremium || false,
                    isNote: lecture.isNote || false,
                    completed: lecture.completed || false,
                    topics: lecture.topics.map((topicId) => ({
                      id: topicId,
                      name: 'Unnamed Topic',
                      type: 'unknown',
                      url: '',
                      completed: false,
                    })),
                  };
                }
              })
            );

            return {
              course: {
                _id: course._id,
                name: course.title || 'Untitled Course',
                image: course.courseImage || 'https://via.placeholder.com/100',
                totalLectures: parseInt(course.lectures, 10) || lectures.length || 0,
                courseTime: course.courseTime || 'N/A',
                level: course.level || 'Beginner',
              },
              lectures: lecturesWithTopics,
            };
          })
        );

        setCourses(formattedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
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
    <>
      {courses.map((item, idx) => (
        <CourseResumeCard key={idx} lectures={item.lectures} course={item.course} />
      ))}
    </>
  );
};

export default MarketingCourse;