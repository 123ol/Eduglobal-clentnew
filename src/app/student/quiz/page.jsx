import courses1 from '@/assets/images/courses/4by3/01.jpg';
import PageMetaData from '@/components/PageMetaData';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import AllStep from './components/AllStep';
const CountdownPage = () => {
  return <>
      <PageMetaData title="Quiz" />
      <Card className="border">
        <CardHeader className="border-bottom">
          <Row>
            <Col xs={12}>
              <Card>
                <Row className="g-0">
                  <Col md={2}>
                    <img src={courses1} className="rounded-2" alt="Card image" />
                  </Col>
                  <Col md={10}>
                    <CardBody>
                      <CardTitle as={'h3'}>
                        <a href="#">The Complete Digital Marketing Course - 12 Courses in 1</a>
                      </CardTitle>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </CardHeader>
        <AllStep />
      </Card>
    </>;
};
export default CountdownPage;
