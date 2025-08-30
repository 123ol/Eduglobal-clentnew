import React from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { FaCertificate } from 'react-icons/fa';

const CertificatesPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Header Section */}
      <header className="bg-primary text-white py-5">
        <Container>
          <h1 className="display-4 text-center mb-3 animate__animated animate__fadeIn">
            My Certificates
          </h1>
          <p className="lead text-center text-white-80 animate__animated animate__fadeIn animate__delay-1s">
            Showcase your achievements with verified certificates
          </p>
        </Container>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 py-5">
        <Container>
          <Card className="border-0 shadow-sm rounded-3 mx-auto" style={{ maxWidth: '600px' }}>
            <Card.Body className="text-center p-5">
              <div className="mb-4">
                <FaCertificate className="display-1 text-primary opacity-75" style={{ transition: 'transform 0.3s' }} />
              </div>
              <h3 className="h5 font-weight-bold text-dark mb-3">No Certificates Yet</h3>
              <p className="text-dark">
                You haven't earned any certificates yet. Complete your courses to unlock verified certificates and showcase your achievements!
              </p>
            </Card.Body>
          </Card>
        </Container>
      </main>
    </div>
  );
};

export default CertificatesPage;