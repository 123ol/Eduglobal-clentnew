import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { courseStatData } from '../data';

const CoursesStat = () => {
  return <>
      <Row className="mb-3">
        <Col xs={12} className="d-sm-flex justify-content-between align-items-center">
          <h1 className="h3 mb-2 mb-sm-0">Courses</h1>
          <Link to="/admin/create-course" className="btn btn-sm btn-primary mb-0">
            Create a Course
          </Link>
        </Col>
      </Row>
      
    </>;
};
export default CoursesStat;
