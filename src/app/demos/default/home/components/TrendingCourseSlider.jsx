import TinySlider from '@/components/TinySlider';
import { currency } from '@/context/constants';
import { useFetchData } from '@/hooks/useFetchData';
import { Card, CardBody, CardFooter, CardTitle } from 'react-bootstrap';
import { renderToString } from 'react-dom/server';
import { FaChevronLeft, FaChevronRight, FaRegBookmark, FaRegClock, FaStar, FaTable } from 'react-icons/fa';
import { useMemo } from 'react';

// Data fetching functions
const getAllCourses = async () => {
  try {
    const response = await fetch('https://eduglobal-servernew-1.onrender.com/api/courses');
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { error: error.message };
  }
};

const getAllCategories = async () => {
  try {
    const response = await fetch('https://eduglobal-servernew-1.onrender.com/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { error: error.message };
  }
};

const TrendingCourseCard = ({ course }) => {
  const {
    name,
    duration,
    avatar,
    studentImage,
    badge,
    rating,
    title,
    price,
    students,
    lectures,
    category
  } = course;

  return (
    <Card className="action-trigger-hover border bg-transparent">
      <img src={studentImage} className="card-img-top" alt="course image" />
      {price === 0 && (
        <div className="ribbon mt-3">
          <span>Free</span>
        </div>
      )}
      <CardBody className="pb-0">
        <div className="d-flex justify-content-between mb-3">
          <span className="hstack gap-2">
            <a href="#" className="badge bg-primary bg-opacity-10 text-primary">
              {category}
            </a>
            <a href="#" className="badge text-bg-dark">
              {badge.text}
            </a>
          </span>
          <a href="#" className="h6 fw-light mb-0">
            <FaRegBookmark />
          </a>
        </div>
        <CardTitle>
          <a href="#">{title}</a>
        </CardTitle>
        <div className="d-flex justify-content-between mb-2">
          <div className="hstack gap-2">
            <p className="text-warning m-0">
              {rating.star}
              <FaStar className="text-warning ms-1" />
            </p>
            <span className="small">({rating.review})</span>
          </div>
          <div className="hstack gap-2">
            <p className="h6 fw-light mb-0 m-0">{students}</p>
            <span className="small">(Student)</span>
          </div>
        </div>
        <div className="hstack gap-3">
          <span className="h6 fw-light mb-0">
            <FaRegClock className="text-danger me-2" />
            {duration}
          </span>
          <span className="h6 fw-light mb-0">
            <FaTable className="text-orange me-2" />
            {lectures} lectures
          </span>
        </div>
      </CardBody>
      <CardFooter className="pt-0 bg-transparent">
        <hr />
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="avatar avatar-sm">
              <img className="avatar-img rounded-1" src={avatar} alt="avatar" />
            </div>
            <p className="mb-0 ms-2">
              <a href="#" className="h6 fw-light mb-0">
                {name}
              </a>
            </p>
          </div>
          <div>
            <h4 className="text-success mb-0 item-show">{price === 0 ? 'Free' : `${currency}${price}`}</h4>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const TrendingCourseSlider = () => {
  // Fetch data from APIs
  const trendingCourses = useFetchData(getAllCourses); // https://eduglobal-servernew-1.onrender.com/api/courses
  const categories = useFetchData(getAllCategories); // https://eduglobal-servernew-1.onrender.com/api/categories

  // Create category lookup map
  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return categories.reduce((map, category) => {
      map[category._id] = category.name;
      return map;
    }, {});
  }, [categories]);

  // Transform course data to match TrendingCourseCard props
  const transformedCourses = useMemo(() => {
    if (!trendingCourses?.courses) return [];
    return trendingCourses.courses.map((course) => ({
      name: course.instructor.name,
      duration: `${course.courseTime} hours`,
      avatar: 'https://via.placeholder.com/50', // Default avatar
      studentImage: course.courseImage,
      badge: { text: course.level || 'Beginner' }, // Use level as badge
      rating: { star: course.averageRating, review: 0 }, // Default review count
      title: course.title,
      price: course.price,
      students: course.enrolledStudents.length,
      lectures: course.totalLecture,
      category: categoryMap[course.category] || 'Unknown' // Map category ID to name
    }));
  }, [trendingCourses, categoryMap]);

  const courseSliderSettings = {
    arrowKeys: true,
    gutter: 30,
    autoplayButton: false,
    autoplayButtonOutput: false,
    controlsText: [renderToString(<FaChevronLeft size={16} />), renderToString(<FaChevronRight size={16} />)],
    autoplay: true,
    controls: true,
    edgePadding: 2,
    items: 3,
    nav: false,
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 2 },
      992: { items: 2 },
      1200: { items: 3 }
    }
  };

  // Handle loading and error states
  if (!trendingCourses || !categories) {
    return <div>Loading...</div>;
  }

  if (trendingCourses.error || categories.error) {
    return <div>Error fetching data. Please try again later.</div>;
  }

  return transformedCourses.length > 0 ? (
    <TinySlider settings={courseSliderSettings} className="pb-1">
      {transformedCourses.slice(0, 4).map((course, idx) => (
        <div key={idx}>
          <TrendingCourseCard course={course} />
        </div>
      ))}
    </TinySlider>
  ) : (
    <div>No courses available.</div>
  );
};

export default TrendingCourseSlider;