import { useState, useEffect, useRef } from 'react';
import { Col, Row, Spinner, Button, Form, Alert } from 'react-bootstrap';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import about4Img from '@/assets/images/about/04.jpg';
import galleryImg from '@/assets/images/element/gallery.svg';
import GlightBox from '@/components/GlightBox';
import { FaPlay } from 'react-icons/fa';
import Cookies from 'js-cookie';

const Step1 = ({ stepperInstance, onCourseCreated }) => {
  const [quillEditorContent, setQuillEditorContent] = useState('');
  const [courseImage, setCourseImage] = useState(null);
  const [videoFiles, setVideoFiles] = useState({ mp4: null, webm: null, ogg: null });
  const [videoURL, setVideoURL] = useState('');
  const [uploadProgress, setUploadProgress] = useState({ image: 0, mp4: 0, webm: 0, ogg: 0 });
  const [downloadURLs, setDownloadURLs] = useState({ image: null, mp4: null, webm: null, ogg: null });
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const glightboxRef = useRef(null);
  const uploadCancelRefs = useRef({ image: null, mp4: null, webm: null, ogg: null });

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = 'dovhdbcns';
  const CLOUDINARY_UPLOAD_PRESET = 'course_upload';

  // Log Cloudinary configuration
  console.log('Cloudinary Config:', {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
  });

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched categories:', data);
      setCategories(data);
      console.log('Updated categories state:', data); // Debug state update
    } catch (err) {
      console.error('Error fetching categories:', err.message);
      setError('Failed to load categories. Please try again.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debug categories state after render
  useEffect(() => {
    console.log('Categories state after render:', categories);
  }, [categories]);

  // Get JWT token
  const getToken = () => {
    const authData = Cookies.get('_EduGlobal_AUTH_KEY_');
    if (authData) {
      try {
        return JSON.parse(authData).token;
      } catch (err) {
        console.error('Failed to parse _EduGlobal_AUTH_KEY_:', err.message);
        return null;
      }
    }
    return null;
  };

  // Function to upload a file to Cloudinary and return its URL
  const uploadFile = async (file, path, type) => {
    if (!file) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `courses/${path}`);

    try {
      const controller = new AbortController();
      uploadCancelRefs.current[type] = controller;

      console.log(`Starting upload for ${type}:`, file.name);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Upload failed for ${type}:`, response.status, errorText);
        throw new Error(`Cloudinary upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Upload successful for ${type}:`, data.secure_url);
      setUploadProgress((prev) => ({ ...prev, [type]: 100 }));
      setIsUploading(false);
      uploadCancelRefs.current[type] = null;
      return data.secure_url;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Upload cancelled for ${type}`);
      } else {
        console.error(`Upload error for ${type}:`, error.message);
        setError(`Failed to upload ${path}: ${error.message}`);
      }
      setIsUploading(false);
      uploadCancelRefs.current[type] = null;
      throw error;
    }
  };

  // Handle image file selection and immediate upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCourseImage(file);
    setUploadProgress((prev) => ({ ...prev, image: 0 }));
    try {
      const imageURL = await uploadFile(file, `images/${Date.now()}_${file.name}`, 'image');
      setDownloadURLs((prev) => ({ ...prev, image: imageURL }));
    } catch (err) {
      // Error handled in uploadFile
    }
  };

  // Handle video file selection and immediate upload
  const handleVideoChange = async (e, format) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFiles((prev) => ({ ...prev, [format]: file }));
    setUploadProgress((prev) => ({ ...prev, [format]: 0 }));
    try {
      const videoURL = await uploadFile(file, `videos/${format}/${Date.now()}_${file.name}`, format);
      setDownloadURLs((prev) => ({ ...prev, [format]: videoURL }));
    } catch (err) {
      // Error handled in uploadFile
    }
  };

  // Cancel upload and clear file
  const cancelUpload = (type) => {
    if (uploadCancelRefs.current[type]) {
      uploadCancelRefs.current[type].abort();
    }
    if (type === 'image') {
      setCourseImage(null);
      setUploadProgress((prev) => ({ ...prev, image: 0 }));
      setDownloadURLs((prev) => ({ ...prev, image: null }));
    } else {
      setVideoFiles((prev) => ({ ...prev, [type]: null }));
      setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
      setDownloadURLs((prev) => ({ ...prev, [type]: null }));
    }
  };

  // Handle form submission and send data to backend
 const onSubmit = async (formData) => {
    try {
      const token = getToken();
      if (!token) {
        setError('Please log in to create a course.');
        return null; // return null instead of false
      }

      if (!formData.category) {
        setError('Please select a category.');
        return null;
      }

      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Course created successfully:', responseData);

        // ✅ return the courseId from backend response
        return responseData._id || responseData.id; 
      } else {
        setError(`Failed to create course: ${responseData.message || response.statusText}`);
        return null;
      }
    } catch (error) {
      setError(`An error occurred while creating the course: ${error.message}`);
      return null;
    }
  };

  // Handle form submission
  const handleNextStep = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = {
        title: e.target.title.value || 'Untitled',
        shortDescription: e.target.shortDescription.value || '',
        category: e.target.category.value || '',
        level: e.target.level.value || 'All Level',
        language: e.target.language.value || '',
        featured: e.target.featured.checked || false,
        courseTime: e.target.courseTime.value || '',
        totalLecture: e.target.totalLecture.value || '',
        price: e.target.price.value || '',
        discountPrice: e.target.discountPrice.value || '',
        discountEnabled: e.target.discountEnabled.checked || false,
        description: quillEditorContent || '',
        courseImage: downloadURLs.image || '',
        videoFiles: {
          mp4: downloadURLs.mp4 || null,
          webm: downloadURLs.webm || null,
          ogg: downloadURLs.ogg || null,
        },
        videoURL: videoURL || '',
        instructor: Cookies.get('userId') || '68aaf71d18e2e8bb908def3c',
      };

      const courseId = await onSubmit(formData);

      if (courseId) {
        if (onCourseCreated) {
          onCourseCreated(courseId);
        }

        if (stepperInstance) {
          stepperInstance.next();
        }
      } else {
        setError('Submission failed. Please check the console for details.');
      }
    } catch (err) {
      setError(`Submission failed: ${err.message}`);
    }
  };

  // Determine video preview URL
  const getVideoPreviewURL = () => {
    return videoURL || downloadURLs.mp4 || downloadURLs.webm || downloadURLs.ogg || 'https://www.youtube.com/embed/tXHviS-4ygo';
  };

  // Handle focus for accessibility
  const handleGlightboxFocus = () => {
    if (glightboxRef.current) {
      glightboxRef.current.focus();
    }
  };

  return (
    <form
      onSubmit={handleNextStep}
      id="step-1"
      role="tabpanel"
      className="content fade course-form"
      aria-labelledby="steppertrigger1"
    >
      <h4>Course Details</h4>
      <hr />
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4">
        <Col xs={12}>
          <Form.Label>Course title</Form.Label>
          <Form.Control type="text" name="title" placeholder="Enter course title" required />
        </Col>
        <Col xs={12}>
          <Form.Label>Short description</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="shortDescription"
            placeholder="Enter keywords"
          />
        </Col>
        <Col md={6}>
          <Form.Label>Course category</Form.Label>
           <ChoicesFormInput name="category" className="form-select js-choice" required>
  <option value="">Select category</option>
  {categories.map((c) => (
    <option key={c._id} value={c._id}>
      {c.name}
    </option>
  ))}
</ChoicesFormInput>

        </Col>
        <Col md={6}>
          <Form.Label>Course level</Form.Label>
          <ChoicesFormInput name="level" className="form-select js-choice">
            <option value="">Select course level</option>
            <option value="All Level">All Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advance">Advance</option>
          </ChoicesFormInput>
        </Col>
        <Col md={6}>
          <Form.Label>Language</Form.Label>
          <ChoicesFormInput name="language" className="form-select js-choice">
            <option value="">Select language</option>
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="French">French</option>
            <option value="Hindi">Hindi</option>
          </ChoicesFormInput>
        </Col>
        <Col md={6} className="d-flex align-items-center justify-content-start mt-5">
          <Form.Check type="switch" id="featured-switch">
            <Form.Check.Input name="featured" />
            <Form.Check.Label>Check this for featured course</Form.Check.Label>
          </Form.Check>
        </Col>
        <Col md={6}>
          <Form.Label>Course time</Form.Label>
          <Form.Control type="text" name="courseTime" placeholder="Enter course time" />
        </Col>
        <Col md={6}>
          <Form.Label>Total lecture</Form.Label>
          <Form.Control type="text" name="totalLecture" placeholder="Enter total lecture" />
        </Col>
        <Col md={6}>
          <Form.Label>Course price</Form.Label>
          <Form.Control type="text" name="price" placeholder="Enter course price" />
        </Col>
        <Col md={6}>
          <Form.Label>Discount price</Form.Label>
          <Form.Control type="text" name="discountPrice" placeholder="Enter discount" />
          <Form.Check className="small mt-1 mb-0">
            <Form.Check.Input name="discountEnabled" />
            <Form.Check.Label>Enable this Discount</Form.Check.Label>
          </Form.Check>
        </Col>
        <Col xs={12}>
          <Form.Label>Add description</Form.Label>
          <ReactQuill
            className="pb-8 pb-sm-0"
            theme="snow"
            style={{ height: 200 }}
            value={quillEditorContent}
            onChange={setQuillEditorContent}
          />
        </Col>
        <Col xs={12}>
          <h4 className="pt-6">Course Media</h4>
          <hr />
          {isUploading && (
            <Alert variant="info" className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              Uploading files to Cloudinary, please wait...
            </Alert>
          )}
          <div className="text-center p-4 border border-2 border-dashed rounded-3 position-relative">
            <img src={galleryImg} className="h-50px mb-2" alt="gallery" />
            <h6>
              Upload course image here, or{' '}
              <label className="text-primary" style={{ cursor: 'pointer' }}>
                Browse
                <input
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageChange}
                />
              </label>
            </h6>
            {courseImage && (
              <div>
                <p>
                  Selected: {courseImage.name}{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancelUpload('image')}
                    disabled={uploadProgress.image === 100}
                  >
                    Cancel
                  </Button>
                </p>
                {uploadProgress.image > 0 && (
                  <progress value={uploadProgress.image} max="100">
                    {uploadProgress.image}%
                  </progress>
                )}
              </div>
            )}
            <p className="small mb-0 mt-2">
              <b>Note:</b> Only JPG, JPEG, and PNG. Suggested dimensions: 600px * 450px.
            </p>
          </div>
          <h5 className="mt-4">Upload video</h5>
          <Form.Control
            className="mb-3"
            type="text"
            name="videoURL"
            placeholder="Enter video URL (e.g., YouTube or Vimeo embed URL)"
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
          />
          <p className="small text-center my-2">Or upload video files</p>
          <div>
            <label>MP4:</label>
            <input
              type="file"
              accept=".mp4"
              className="form-control mb-2"
              onChange={(e) => handleVideoChange(e, 'mp4')}
            />
            {videoFiles.mp4 && (
              <div>
                <p>
                  Selected: {videoFiles.mp4.name}{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancelUpload('mp4')}
                    disabled={uploadProgress.mp4 === 100}
                  >
                    Cancel
                  </Button>
                </p>
                {uploadProgress.mp4 > 0 && (
                  <progress value={uploadProgress.mp4} max="100">
                    {uploadProgress.mp4}%
                  </progress>
                )}
              </div>
            )}
          </div>
          <div>
            <label>WebM:</label>
            <input
              type="file"
              accept=".webm"
              className="form-control mb-2"
              onChange={(e) => handleVideoChange(e, 'webm')}
            />
            {videoFiles.webm && (
              <div>
                <p>
                  Selected: {videoFiles.webm.name}{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancelUpload('webm')}
                    disabled={uploadProgress.webm === 100}
                  >
                    Cancel
                  </Button>
                </p>
                {uploadProgress.webm > 0 && (
                  <progress value={uploadProgress.webm} max="100">
                    {uploadProgress.webm}%
                  </progress>
                )}
              </div>
            )}
          </div>
          <div>
            <label>OGG:</label>
            <input
              type="file"
              accept=".ogg"
              className="form-control mb-2"
              onChange={(e) => handleVideoChange(e, 'ogg')}
            />
            {videoFiles.ogg && (
              <div>
                <p>
                  Selected: {videoFiles.ogg.name}{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancelUpload('ogg')}
                    disabled={uploadProgress.ogg === 100}
                  >
                    Cancel
                  </Button>
                </p>
                {uploadProgress.ogg > 0 && (
                  <progress value={uploadProgress.ogg} max="100">
                    {uploadProgress.ogg}%
                  </progress>
                )}
              </div>
            )}
          </div>
          <h5 className="mt-4">Video preview</h5>
          <div className="position-relative" style={{ maxWidth: '300px', margin: '0 auto' }}>
            <img
              src={downloadURLs.image || about4Img}
              className="rounded-4 img-fluid"
              alt="preview"
              style={{ width: '100%', height: 'auto' }}
            />
            <div className="position-absolute top-50 start-50 translate-middle">
              <GlightBox
                href={getVideoPreviewURL()}
                className="btn btn-sm text-danger btn-round btn-white-shadow mb-0"
                data-glightbox
                data-gallery="video-tour"
                ref={glightboxRef}
                onClick={handleGlightboxFocus}
              >
                <FaPlay />
              </GlightBox>
            </div>
          </div>
        </Col>
        <div className="d-flex justify-content-end mt-4">
          <Button type="submit" className="btn btn-primary next-btn mb-0" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Next'}
          </Button>
        </div>
      </Row>
    </form>
  );
};

export default Step1;