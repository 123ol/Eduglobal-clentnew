import { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row, Modal, Form, Alert } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight, FaSearch, FaEdit } from 'react-icons/fa';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import PageMetaData from '@/components/PageMetaData';
import Cookies from 'js-cookie';

const CourseCategory = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(8);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategory, setEditCategory] = useState({ id: '', name: '' });
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('Sort by');

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

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://eduglobal-servernew-1.onrender.com/api/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched categories:', JSON.stringify(data, null, 2));
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err.message);
      setError('Failed to load categories. Please try again.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle create category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setError(null);
    const token = getToken();
    if (!token) {
      setError('Please log in to create a category.');
      return;
    }
    if (!newCategoryName) {
      setError('Category name is required.');
      return;
    }

    try {
      const response = await fetch('https://eduglobal-servernew-1.onrender.com/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const data = await response.json();
      if (response.ok) {
        setNewCategoryName('');
        setShowCreateModal(false);
        await fetchCategories();
        console.log('Category created:', data);
      } else {
        setError(data.message || 'Failed to create category.');
      }
    } catch (err) {
      console.error('Create category error:', err.message);
      setError('Failed to create category: ' + err.message);
    }
  };

  // Handle edit category
  const handleEditCategory = async (e) => {
    e.preventDefault();
    setError(null);
    const token = getToken();
    if (!token) {
      setError('Please log in to edit a category.');
      return;
    }
    if (!editCategory.name) {
      setError('Category name is required.');
      return;
    }

    try {
      const response = await fetch(`https://eduglobal-servernew-1.onrender.com/api/categories/${editCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editCategory.name }),
      });

      const data = await response.json();
      if (response.ok) {
        setEditCategory({ id: '', name: '' });
        setShowEditModal(false);
        await fetchCategories();
        console.log('Category updated:', data);
      } else {
        setError(data.message || 'Failed to update category.');
      }
    } catch (err) {
      console.error('Update category error:', err.message);
      setError('Failed to update category: ' + err.message);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (id) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError('Please log in to delete a category.');
      return;
    }

    try {
      const response = await fetch(`https://eduglobal-servernew-1.onrender.com/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        await fetchCategories();
        console.log('Category deleted:', data);
      } else {
        setError(data.message || 'Failed to delete category.');
      }
    } catch (err) {
      console.error('Delete category error:', err.message);
      setError('Failed to delete category: ' + err.message);
    }
  };

  // Open edit modal with category data
  const openEditModal = (category) => {
    setEditCategory({ id: category._id, name: category.name });
    setShowEditModal(true);
  };

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle sort change (placeholder, as backend doesn't support sorting yet)
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    // Sorting logic can be added here when backend supports it
  };

  return (
    <>
      <PageMetaData title="Course Category" />
      <div>
        <Row className="mb-3">
          <Col xs={12} className="d-sm-flex justify-content-between align-items-center">
            <h1 className="h3 mb-2 mb-sm-0">Categories</h1>
            <Button
              className="btn btn-sm btn-primary mb-0"
              onClick={() => setShowCreateModal(true)}
            >
              Create a Category
            </Button>
          </Col>
        </Row>
        {error && <Alert variant="danger">{error}</Alert>}
        <Card className="bg-transparent border">
          <CardHeader className="bg-light border-bottom">
            <Row className="g-3 align-items-center justify-content-between">
              <Col md={8}>
                <form className="rounded position-relative">
                  <input
                    className="form-control bg-body"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button
                    className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                    type="submit"
                  >
                    <FaSearch />
                  </button>
                </form>
              </Col>
              <Col md={3}>
                <form>
                  <ChoicesFormInput
                    className="form-select js-choice border-0 z-index-9"
                    aria-label=".form-select-sm"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="Sort by">Sort by</option>
                    <option value="Newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </ChoicesFormInput>
                </form>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <div className="table-responsive border-0 rounded-3">
              <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                <thead>
                  <tr>
                    <th scope="col" className="border-0 rounded-start">
                      Category Name
                    </th>
                    <th scope="col" className="border-0">
                      Course Count
                    </th>
                    <th scope="col" className="border-0">
                      Courses
                    </th>
                    <th scope="col" className="border-0 rounded-end">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>{category.courseCount}</td>
                      <td>
                        {category.courseNames && category.courseNames.length > 0 ? (
                          <ul className="mb-0">
                            {category.courseNames.map((courseName, index) => (
                              <li key={index}>{courseName}</li>
                            ))}
                          </ul>
                        ) : (
                          'No courses'
                        )}
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => openEditModal(category)}
                        >
                          <FaEdit /> Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {currentCategories.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
          <CardFooter className="bg-transparent pt-0">
            <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
              <p className="mb-0 text-center text-sm-start">
                Showing {indexOfFirstCategory + 1} to{' '}
                {Math.min(indexOfLastCategory, categories.length)} of {categories.length}{' '}
                entries
              </p>
              <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
                <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                  <li className="page-item mb-0">
                    <Button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FaAngleLeft />
                    </Button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li
                      key={page}
                      className={`page-item mb-0 ${currentPage === page ? 'active' : ''}`}
                    >
                      <Button className="page-link" onClick={() => paginate(page)}>
                        {page}
                      </Button>
                    </li>
                  ))}
                  <li className="page-item mb-0">
                    <Button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <FaAngleRight />
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          </CardFooter>
        </Card>
        {/* Create Category Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreateCategory}>
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        {/* Edit Category Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditCategory}>
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={editCategory.name}
                  onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                  autoFocus
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default CourseCategory;