import { useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar, Row, Alert, Modal, Button, Form } from 'react-bootstrap';
import { BsCalendar, BsEnvelopeFill, BsPencilSquare, BsThreeDots, BsTrash } from 'react-icons/bs';
import { FaBan, FaBook, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useFetchData } from './useFetchData';
import axios from 'axios';
import { ethers } from 'ethers';
import CertificateNFT from '../../../../contracts/CertificateNFT.json';

const StudentCard = ({ id, location, progress, totalCourses, name, email, date, avatar, courses }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleCertificateUpload = async (courseId, file) => {
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }

    const authData = Cookies.get('_EduGlobal_AUTH_KEY_');
    if (!authData) {
      setUploadError('Authentication required');
      return;
    }

    let token;
    try {
      const parsed = JSON.parse(authData);
      token = parsed.token;
      if (!token || parsed.role !== 'admin') {
        setUploadError('Admin authentication required');
        return;
      }
    } catch (err) {
      setUploadError('Auth error: ' + err.message);
      return;
    }

    if (!window.ethereum) {
      setUploadError('MetaMask is required for NFT minting');
      return;
    }

    try {
      // Upload certificate to IPFS via Pinata
      const formData = new FormData();
      formData.append('file', file);

      const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      });

      const fileUrl = `https://gateway.pinata.cloud/ipfs/${pinataResponse.data.IpfsHash}`;

      // Create NFT metadata
      const metadata = {
        name: `Certificate for ${name} - ${courses.find(c => c.courseId === courseId).title}`,
        description: `Certificate of completion for ${name} in ${courses.find(c => c.courseId === courseId).title}`,
        image: fileUrl,
        attributes: [
          { trait_type: 'Student', value: name },
          { trait_type: 'Course', value: courses.find(c => c.courseId === courseId).title },
          { trait_type: 'Completion Date', value: new Date().toISOString() },
        ],
      };

      // Upload metadata to IPFS
      const metadataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
        headers: {
          'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      });

      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;

      // Mint NFT
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
        CertificateNFT.abi,
        signer
      );

      const tx = await contract.mint(id, metadataUrl);
      const receipt = await tx.wait();
      const tokenId = receipt.logs[0].args.tokenId.toString();

      // Send to backend
      const response = await fetch('https://eduglobal-servernew-1.onrender.com/api/certificates/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id,
          courseId,
          nftMetadataUrl: metadataUrl,
          tokenId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to store NFT certificate: ${errorText}`);
      }

      setUploadSuccess(`NFT Certificate minted for course ${courseId} (Token ID: ${tokenId})`);
      setSelectedFile(null);
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err) {
      setUploadError('Error minting NFT certificate: ' + err.message);
      setTimeout(() => setUploadError(null), 5000);
    }
  };

  const handleFileChange = (e, courseId) => {
    const file = e.target.files[0];
    setSelectedFile({ courseId, file });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, courseId) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setSelectedFile({ courseId, file });
    } else {
      setUploadError('Please upload a valid .pdf, .png, .jpg, or .jpeg file');
      setTimeout(() => setUploadError(null), 5000);
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
                <DropdownItem onClick={(e) => { e.stopPropagation(); deleteStudent(); }}>
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
                  onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => e.stopPropagation()}
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
          {uploadSuccess && (
            <Alert variant="success" className="d-flex align-items-center animate__animated animate__fadeIn">
              <FaCheckCircle className="me-2" />
              {uploadSuccess}
            </Alert>
          )}
          {uploadError && (
            <Alert variant="danger" className="d-flex align-items-center animate__animated animate__fadeIn">
              <FaExclamationCircle className="me-2" />
              {uploadError}
            </Alert>
          )}
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
            {courses && courses.length > 0 ? (
              <ul className="list-unstyled">
                {courses.map((course) => (
                  <li key={course.courseId} className="mb-4">
                    <div>{course.title}: {course.progress}%</div>
                    <ProgressBar
                      variant="primary"
                      now={course.progress}
                      className="mt-2"
                      style={{ height: '10px' }}
                    />
                    {course.progress === 100 && !course.nftMetadataUrl && (
                      <div className="mt-3 p-3 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h6 className="mb-3 text-primary">Mint NFT Certificate</h6>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white hover:bg-gray-100 transition-colors duration-200"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, course.courseId)}
                        >
                          <Form.Group>
                            <Form.Label className="text-muted mb-2">
                              Drag and drop a .pdf, .png, .jpg, or .jpeg file here, or click to select
                            </Form.Label>
                            <Form.Control
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileChange(e, course.courseId)}
                              className="d-none"
                              id={`file-input-${course.courseId}`}
                            />
                            <label
                              htmlFor={`file-input-${course.courseId}`}
                              className="btn btn-outline-primary w-100 mb-2"
                            >
                              Choose File
                            </label>
                            {selectedFile && selectedFile.courseId === course.courseId && (
                              <p className="mb-0 text-sm text-gray-600">
                                Selected: {selectedFile.file.name}
                              </p>
                            )}
                          </Form.Group>
                        </div>
                        <Button
                          variant="primary"
                          className="w-100 mt-3"
                          disabled={!selectedFile || selectedFile.courseId !== course.courseId}
                          onClick={() => handleCertificateUpload(course.courseId, selectedFile.file)}
                        >
                          Mint Certificate
                        </Button>
                      </div>
                    )}
                    {course.nftMetadataUrl && (
                      <div className="mt-2">
                        <a
                          href={course.nftMetadataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View NFT Metadata
                        </a>{' '}
                        (Token ID: {course.tokenId})
                      </div>
                    )}
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

  if (!students || students.length === 0) {
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