import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Row,
  Alert,
} from "react-bootstrap";
import { FaEdit, FaPlay, FaTimes } from "react-icons/fa";
import AddLecture from "./AddLecture";
import AddTopic from "./AddTopic";
import Cookies from "js-cookie";

const Step2 = ({ stepperInstance, courseId }) => {
  const [lectures, setLectures] = useState([]);
  const [error, setError] = useState(null);

  const getToken = () => {
    const authData = Cookies.get("_EduGlobal_AUTH_KEY_");
    return authData ? JSON.parse(authData).token : null;
  };

  const fetchLectures = async () => {
    if (!courseId) {
      setError("Course ID is missing.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${courseId}/lectures`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch lectures: ${response.statusText}`);
      }
      const data = await response.json();
      setLectures(data);
    } catch (err) {
      setError("Failed to load lectures. Please try again.");
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  // --- Delete Lecture ---
  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Please log in to delete a lecture.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/lectures/${lectureId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        await fetchLectures();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete lecture.");
      }
    } catch (err) {
      setError("Failed to delete lecture: " + err.message);
    }
  };

  // --- Delete Topic ---
  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Please log in to delete a topic.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/topics/${topicId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        await fetchLectures();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete topic.");
      }
    } catch (err) {
      setError("Failed to delete topic: " + err.message);
    }
  };

  // --- Stepper Navigation ---
  const goToNextStep = (e) => {
    e.preventDefault();
    stepperInstance?.next();
  };

  const goToPreviousStep = (e) => {
    e.preventDefault();
    stepperInstance?.previous();
  };

  return (
    <form
      id="step-2"
      onSubmit={goToNextStep}
      className="content fade"
      aria-labelledby="steppertrigger2"
    >
      <hr />
      <Row>
        <div className="d-sm-flex justify-content-sm-between align-items-center mb-3">
          <h5 className="mb-2 mb-sm-0">Upload Lecture</h5>
          <AddLecture courseId={courseId} onLectureAdded={fetchLectures} />
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Accordion
          className="accordion-icon accordion-bg-light"
          id="accordionExample2"
        >
          {lectures.map((lecture) => (
            <AccordionItem
              key={lecture._id}
              eventKey={lecture._id}
              className="mb-3"
            >
             <AccordionHeader
  as="div" // 🔹 render as div, not as <h6> containing a <button>
  className="font-base d-flex justify-content-between align-items-center"
  id={`heading-${lecture._id}`}
>
  {/* This is the accordion toggle (clickable title) */}
  <span className="fw-bold flex-grow-1">{lecture.title}</span>

  {/* Action buttons (NOT inside the accordion button) */}
  <div className="ms-2 d-flex">
    <Button
      as="span" // 🔹 renders as <span>, avoids nested <button>
      variant="success-soft"
      size="sm"
      className="btn-round me-1"
      onClick={() => alert("TODO: open EditLectureModal")}
    >
      <FaEdit />
    </Button>
    <Button
      as="span" // 🔹 same trick here
      variant="danger-soft"
      size="sm"
      className="btn-round"
      onClick={() => handleDeleteLecture(lecture._id)}
    >
      <FaTimes />
    </Button>
  </div>
</AccordionHeader>


              <AccordionBody className="mt-3">
                {lecture.topics.map((topic) => (
                  <div key={topic._id}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="position-relative">
                        <Button
                          variant="danger-soft"
                          size="sm"
                          className="btn-round mb-0 stretched-link position-static"
                        >
                          <FaPlay />
                        </Button>
                        <span className="ms-2 mb-0 h6 fw-light">
                          {topic.name}
                        </span>
                      </div>
                      <div>
                        {/* Edit Topic - TODO: Replace with EditTopicModal */}
                        <Button
                          variant="success-soft"
                          size="sm"
                          className="btn-round me-1 mb-1 mb-md-0"
                          onClick={() => alert("TODO: open EditTopicModal")}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger-soft"
                          size="sm"
                          className="btn-round mb-0"
                          onClick={() => handleDeleteTopic(topic._id)}
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}

                <AddTopic lectureId={lecture._id} onTopicAdded={fetchLectures} />
              </AccordionBody>
            </AccordionItem>
          ))}

          {lectures.length === 0 && (
            <p className="text-center">No lectures found. Add a lecture to start.</p>
          )}
        </Accordion>

        <div className="d-flex justify-content-between">
          <Button
            className="btn btn-secondary prev-btn mb-0"
            onClick={goToPreviousStep}
          >
            Previous
          </Button>
          <Button type="submit" className="btn btn-primary next-btn mb-0">
            Next
          </Button>
        </div>
      </Row>
    </form>
  );
};

export default Step2;
