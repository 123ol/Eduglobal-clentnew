import { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import Cookies from "js-cookie";

const AddLecture = ({ courseId, onLectureAdded }) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    const authData = Cookies.get("_EduGlobal_AUTH_KEY_");
    return authData ? JSON.parse(authData).token : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    setError(null);

    const token = getToken();
    if (!token) {
      setError("Please log in to add a lecture.");
      return;
    }
    if (!title.trim()) {
      setError("Lecture title is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://eduglobal-servernew-1.onrender.com/api/courses/${courseId}/lectures`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTitle("");
        setShow(false);
        if (onLectureAdded) onLectureAdded(); // let Step2 refetch lectures
      } else {
        setError(data.message || "Failed to create lecture.");
      }
    } catch (err) {
      setError("Failed to create lecture: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setShow(true)}>
        Add Lecture
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Lecture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Lecture Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter lecture title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-flex justify-content-end mt-3">
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

export default AddLecture;
