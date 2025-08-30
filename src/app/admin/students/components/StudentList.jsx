import { useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar, Row, Alert, Modal, Button } from 'react-bootstrap';
import { BsCalendar, BsEnvelopeFill, BsPencilSquare, BsThreeDots, BsTrash } from 'react-icons/bs';
import { FaBan, FaBook, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useFetchData } from './useFetchData';

const StudentCard = ({ id, location, progress, totalCourses, name, email, date, avatar, courses }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const deleteStudent = async () => {
    const authData = Cookies.get('_EduGlobal_AUTH_KEY_');
    if (!authData) {
      alert('Authentication required');
      return;
    }

    let token;
    try {
      const parsed = JSON.parse(authData);
      token = parsed.token;
      if (!token || parsed.role !== 'admin') {
        alert('Admin authentication required');
        return;
      }
    } catch (err) {
      alert('Auth error: ' + err.message);
      return;
    }

    try {
      const response = await fetch(`https://eduglobal-servernew-1.onrender.com/api/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete student: ${response.statusText}`);
      }

      setIsDeleted(true);
      alert('Student deleted successfully');
    } catch (err) {
      alert('Error deleting student: ' + err.message);
    }
  };

  if (isDeleted) return null;

  return (
    <>
      <Col md={6} xxl={4}>
        <Card
          className="bg-transparent border h-100"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        >
          <CardHeader className="bg-transparent border-bottom d-flex justify-content-between">
            <div className="d-sm-flex align-items-center">
              <div className="avatar avatar-md flex-shrink-0">
                {avatar ? (
                  <img className="avatar-img rounded-circle" src={avatar} alt="avatar" />
                ) : (
                  <img className="avatar-img rounded-circle" src="/images/default-avatar.png" alt="avatar" />
                )}
              </div>
              <div className="ms-0 ms-sm-2 mt-2 mt-sm-0">
                <h5 className="mb-0">{name}</h5>
                <span className="text-body small icons-center">
                  <FaMapMarkerAlt className="me-1 mt-1" />
                  {location || 'Unknown'}
                </span>
              </div>
            </div>
            <Dropdown drop="end" align="end">
              <DropdownToggle className="btn btn-sm btn-light btn-round small mb-0 arrow-none">
                <BsThreeDots />
              </DropdownToggle>
              <DropdownMenu className="dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded">
                <DropdownItem href="#">
                  <BsPencilSquare className="me-2" />
                  Edit
                </DropdownItem>
                <DropdownItem onClick={deleteStudent}>
                  <BsTrash className="me-2" />
                  Remove
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardHeader>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <div className="icon-md bg-purple bg-opacity-10 text-purple rounded-circle flex-shrink-0">
                  <FaBook />
                </div>
                <h6 className="mb-0 ms-2 fw-light">Total Courses</h6>
              </div>
              <span className="mb-0 fw-bold">{totalCourses}</span>
            </div>
            <div className="overflow-hidden">
              <h6 className="mb-0">{progress}%</h6>
              <ProgressBar
                variant="primary"
                className="progress-sm bg-opacity-10 aos"
                data-aos="slide-right"
                data-aos-delay={200}
                data-aos-duration={1000}
                data-aos-easing="ease-in-out"
                now={progress}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </CardBody>
          <CardFooter className="bg-transparent border-top">
            <div className="d-sm-flex justify-content-between align-items-center">
              <h6 className="mb-2 mb-sm-0 icons-center">
                <BsCalendar className="bi bi-calendar fa-fw text-orange me-2" />
                <span className="text-body">Join at:</span>&nbsp;
                {date.toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </h6>
              <div className="text-end text-primary-hover">
                <Link
                  to="#"
                  className="btn btn-link text-body p-0 mb-0 me-2"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-original-title="Message"
                  aria-label="Message"
                >
                  <BsEnvelopeFill />
                </Link>
                <Link
                  to="#"
                  className="btn btn-link text-body p-0 mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-original-title="Block"
                  aria-label="Block"
                >
                  <FaBan className="fas fa-ban" />
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Col>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{name}'s Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Name:</strong> {name || 'Unknown'}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {email || 'Unknown'}
          </div>
          <div className="mb-3">
            <strong>Location:</strong> {location || 'Unknown'}
          </div>
          <div className="mb-3">
            <strong>Join Date:</strong>{' '}
            {date.toLocaleString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
          <div className="mb-3">
            <strong>Total Courses:</strong> {totalCourses}
          </div>
          <div className="mb-3">
            <strong>Overall Progress:</strong> {progress}%
          </div>
          <div>
            <strong>Enrolled Courses:</strong>
            {courses.length > 0 ? (
              <ul>
                {courses.map((course) => (
                  <li key={course.courseId}>
                    {course.title}: {course.progress}%{' '}
                    <ProgressBar
                      variant="primary"
                      now={course.progress}
                      style={{ height: '10px', marginTop: '5px' }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No courses enrolled</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const StudentGrid = () => {
  const { data: students, loading, error } = useFetchData();

  if (loading) {
    return <div>Loading students...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <strong>Error:</strong> {error}. Please ensure the backend server is running and the <code>/api/students</code> or <code>/api/students/enrolled</code> endpoints are correctly configured in <code>students.js</code>. Check server logs or contact the administrator.
      </Alert>
    );
  }

  if (students.length === 0) {
    return <Alert variant="info">No students found. Try adjusting the search criteria or adding new students.</Alert>;
  }

  return (
    <>
      {students.some(student => student.id === '68af7575951ab7b99b20e39f') && students.every(student => student.totalCourses === 0) && (
        <Alert variant="warning">
          <strong>Warning:</strong> Student data may be from mock data or incomplete. No enrolled courses detected for student ID <code>68af7575951ab7b99b20e39f</code>. Please verify <code>Enrollment</code> records or <code>Course.enrolledStudents</code> in the database and use <code>POST /api/courses/:id/enroll</code> to enroll students.
        </Alert>
      )}
      {students.every(student => student.progress === 0) && students.some(student => student.totalCourses > 0) && (
        <Alert variant="warning">
          <strong>Warning:</strong> No students have progress. Please verify <code>UserProgress</code> records (ensure <code>completed: true</code> for some topics) and ensure courses have lectures and topics in the database.
        </Alert>
      )}
      <Row className="g-4">{students.map((item, idx) => <StudentCard key={idx} {...item} />)}</Row>
    </>
  );
};

export default StudentGrid;