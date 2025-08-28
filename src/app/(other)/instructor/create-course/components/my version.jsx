import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import about4Img from '@/assets/images/about/04.jpg';
import galleryImg from '@/assets/images/element/gallery.svg';
import GlightBox from '@/components/GlightBox';
import { FaPlay } from 'react-icons/fa';

const  Step1 = ({ stepperInstance, onSubmit }) => {
  // Step1 states
  const [quillEditorContent, setQuillEditorContent] = useState('');
  const [courseImage, setCourseImage] = useState(null);
  const [videoFiles, setVideoFiles] = useState({ mp4: null, webm: null, ogg: null });
  const [videoURL, setVideoURL] = useState('');

  // Handle step submission
  const handleNextStep = async (e) => {
    e.preventDefault();

    // Gather form data
    const formData = {
      title: e.target.title.value,
      shortDescription: e.target.shortDescription.value,
      category: e.target.category.value,
      level: e.target.level.value,
      language: e.target.language.value,
      featured: e.target.featured.checked,
      courseTime: e.target.courseTime.value,
      totalLecture: e.target.totalLecture.value,
      price: e.target.price.value,
      discountPrice: e.target.discountPrice.value,
      discountEnabled: e.target.discountEnabled.checked,
      description: quillEditorContent,
      courseImage,
      videoFiles,
      videoURL,
    };

    try {
      const success = await onSubmit(formData); // call backend API
      if (success) {
        stepperInstance?.next(); // go to next step only if API success
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleNextStep} className="course-form">
      {/* Step 1: Course Details */}
      <h4>Course Details</h4>
      <hr />
      <Row className="g-4">
        <Col xs={12}>
          <label className="form-label">Course title</label>
          <input className="form-control" type="text" name="title" placeholder="Enter course title" />
        </Col>
        <Col xs={12}>
          <label className="form-label">Short description</label>
          <textarea className="form-control" rows={2} name="shortDescription" placeholder="Enter keywords" />
        </Col>
        <Col md={6}>
          <label className="form-label">Course category</label>
          <ChoicesFormInput name="category" className="form-select">
            <option>Select category</option>
            <option>Engineer</option>
            <option>Medical</option>
            <option>Information technology</option>
            <option>Finance</option>
            <option>Marketing</option>
          </ChoicesFormInput>
        </Col>
        <Col md={6}>
          <label className="form-label">Course level</label>
          <ChoicesFormInput name="level" className="form-select">
            <option>Select course level</option>
            <option>All level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advance</option>
          </ChoicesFormInput>
        </Col>
        <Col md={6}>
          <label className="form-label">Language</label>
          <ChoicesFormInput name="language" className="form-select">
            <option>Select language</option>
            <option>English</option>
            <option>German</option>
            <option>French</option>
            <option>Hindi</option>
          </ChoicesFormInput>
        </Col>
        <Col md={6} className="d-flex align-items-center justify-content-start mt-5">
          <div className="form-check form-switch form-check-md">
            <input className="form-check-input" type="checkbox" name="featured" />
            <label className="form-check-label">Check this for featured course</label>
          </div>
        </Col>
        <Col md={6}>
          <label className="form-label">Course time</label>
          <input className="form-control" type="text" name="courseTime" placeholder="Enter course time" />
        </Col>
        <Col md={6}>
          <label className="form-label">Total lecture</label>
          <input className="form-control" type="text" name="totalLecture" placeholder="Enter total lecture" />
        </Col>
        <Col md={6}>
          <label className="form-label">Course price</label>
          <input type="text" className="form-control" name="price" placeholder="Enter course price" />
        </Col>
        <Col md={6}>
          <label className="form-label">Discount price</label>
          <input className="form-control" type="text" name="discountPrice" placeholder="Enter discount" />
          <div className="form-check small mt-1 mb-0">
            <input className="form-check-input" type="checkbox" name="discountEnabled" />
            <label className="form-check-label">Enable this Discount</label>
          </div>
        </Col>
        <Col xs={12}>
          <label className="form-label">Add description</label>
          <ReactQuill
            className="pb-2 pb-sm-0"
            theme="snow"
            style={{ height: 400 }}
            value={quillEditorContent}
            onChange={setQuillEditorContent}
          />
        </Col>

        {/* Step 2: Media Upload */}
        <Col xs={12}>
          <h4>Course Media</h4>
          <hr />
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
                  onChange={(e) => setCourseImage(e.target.files[0])}
                />
              </label>
            </h6>
            <p className="small mb-0 mt-2">
              <b>Note:</b> Only JPG, JPEG and PNG. Suggested dimensions: 600px * 450px.
            </p>
          </div>

          <h5 className="mt-4">Upload video</h5>
          <input
            className="form-control mb-3"
            type="text"
            name="videoURL"
            placeholder="Enter video url"
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
          />

          <p className="small text-center my-2">Or upload video files</p>

          <input type="file" accept=".mp4" className="mb-2" onChange={(e) => setVideoFiles({ ...videoFiles, mp4: e.target.files[0] })} />
          <input type="file" accept=".webm" className="mb-2" onChange={(e) => setVideoFiles({ ...videoFiles, webm: e.target.files[0] })} />
          <input type="file" accept=".ogg" className="mb-2" onChange={(e) => setVideoFiles({ ...videoFiles, ogg: e.target.files[0] })} />

          <h5 className="mt-4">Video preview</h5>
          <div className="position-relative">
            <img src={about4Img} className="rounded-4" alt="preview" />
            <div className="position-absolute top-50 start-50 translate-middle">
              <GlightBox
                href="https://www.youtube.com/embed/tXHviS-4ygo"
                className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
                data-glightbox
                data-gallery="video-tour"
              >
                <FaPlay />
              </GlightBox>
            </div>
          </div>
        </Col>

        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn btn-primary next-btn mb-0">
            Next
          </button>
        </div>
      </Row>
    </form>
  );
};

export default Step1;
