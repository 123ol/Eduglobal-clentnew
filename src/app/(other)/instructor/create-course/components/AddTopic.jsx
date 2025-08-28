import { useState, useRef } from "react";
import { Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import Cookies from "js-cookie";

const AddTopic = ({ lectureId, onTopicAdded }) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState("video");
  const [resourceLink, setResourceLink] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const uploadCancelRef = useRef(null);

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = 'dovhdbcns';
  const CLOUDINARY_UPLOAD_PRESET = 'course_upload';

  const getToken = () => {
    const authData = Cookies.get("_EduGlobal_AUTH_KEY_");
    return authData ? JSON.parse(authData).token : null;
  };

  // Upload file (video or PDF) to Cloudinary
  const uploadFile = async (file, resourceType) => {
    if (!file) return null;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `courses/${resourceType}s/${Date.now()}_${file.name}`);

    try {
      const controller = new AbortController();
      uploadCancelRef.current = controller;

      console.log(`Starting ${resourceType} upload: ${file.name}`);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`${resourceType} upload failed: ${response.status} ${errorText}`);
        throw new Error(`Cloudinary upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`${resourceType} upload successful: ${data.secure_url}`);
      setUploadProgress(100);
      setLoading(false);
      uploadCancelRef.current = null;
      return data.secure_url;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`${resourceType} upload cancelled`);
      } else {
        console.error(`${resourceType} upload error:`, error.message);
        setError(`Failed to upload ${resourceType}: ${error.message}`);
      }
      setLoading(false);
      uploadCancelRef.current = null;
      throw error;
    }
  };

  // Handle file selection (video or PDF)
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadProgress(0);
    try {
      const fileURL = await uploadFile(selectedFile, resourceType);
      setResourceLink(fileURL);
    } catch (err) {
      // Error handled in uploadFile
    }
  };

  // Cancel file upload
  const cancelUpload = () => {
    if (uploadCancelRef.current) {
      uploadCancelRef.current.abort();
    }
    setFile(null);
    setUploadProgress(0);
    setResourceLink('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);

    const token = getToken();
    if (!token) {
      setError("Please log in to add a topic.");
      return;
    }
    if (!name || !resourceType) {
      setError("Topic name and resource type are required.");
      return;
    }
    if (!resourceLink && !file) {
      setError(`Please provide a ${resourceType} file or URL.`);
      return;
    }

    try {
      setLoading(true);
      let finalResourceLink = resourceLink;

      // If file is selected, upload it
      if (file) {
        finalResourceLink = await uploadFile(file, resourceType);
      }

      const response = await fetch(
        `https://eduglobal-servernew-1.onrender.com/api/lectures/${lectureId}/topics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            resourceType,
            resourceLink: finalResourceLink,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setName("");
        setDescription("");
        setResourceType("video");
        setResourceLink("");
        setFile(null);
        setUploadProgress(0);
        setShow(false);
        if (onTopicAdded) onTopicAdded();
      } else {
        setError(data.message || "Failed to create topic.");
      }
    } catch (err) {
      setError("Failed to create topic: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setShow(true)}>
        Add Topic
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Topic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Topic Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter topic name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter topic description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resource Type</Form.Label>
              <Form.Select
                value={resourceType}
                onChange={(e) => {
                  setResourceType(e.target.value);
                  setResourceLink('');
                  setFile(null);
                  setUploadProgress(0);
                }}
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload {resourceType === 'video' ? 'Video' : 'PDF'} or Enter URL</Form.Label>
              <div className="border border-2 border-dashed rounded-3 p-3 text-center">
                <h6>
                  Upload {resourceType === 'video' ? 'video' : 'PDF'} here, or{' '}
                  <label className="text-primary" style={{ cursor: 'pointer' }}>
                    Browse
                    <input
                      type="file"
                      accept={resourceType === 'video' ? 'video/mp4,video/webm,video/ogg' : '.pdf'}
                      className="d-none"
                      onChange={handleFileChange}
                    />
                  </label>
                </h6>
                {file && (
                  <div>
                    <p>
                      Selected: {file.name}{' '}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={cancelUpload}
                        disabled={uploadProgress === 100}
                      >
                        Cancel
                      </Button>
                    </p>
                    {uploadProgress > 0 && (
                      <progress value={uploadProgress} max="100">
                        {uploadProgress}%
                      </progress>
                    )}
                  </div>
                )}
                <p className="small mb-0 mt-2">
                  <b>Note:</b> {resourceType === 'video' ? 'Only MP4, WebM, or OGG videos are supported.' : 'Only PDF files are supported.'}
                </p>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Or Enter {resourceType === 'video' ? 'Video' : 'PDF'} URL</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter ${resourceType === 'video' ? 'video' : 'PDF'} URL (e.g., Cloudinary URL)`}
                value={resourceLink}
                onChange={(e) => setResourceLink(e.target.value)}
                disabled={file !== null}
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading && (
              <Alert variant="info" className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                Uploading {resourceType} to Cloudinary, please wait...
              </Alert>
            )}
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShow(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddTopic;