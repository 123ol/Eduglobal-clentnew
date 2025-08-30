import { BsBasket, BsBasketFill, BsCardChecklist, BsCartCheck, BsCartCheckFill, BsCreditCard2Front, BsCreditCard2FrontFill, BsFileCheckFill, BsFileEarmarkPlusFill, BsFolderCheck, BsGear, BsGraphUp, BsGridFill, BsHouse, BsLock, BsPencilSquare, BsPeople, BsQuestionDiamond, BsStar, BsStarFill, BsTrash, BsUiChecksGrid, BsUiRadiosGrid, BsWallet2 } from 'react-icons/bs';
import {  FaChartBar, FaCog, FaEdit, FaRegCommentDots, FaRegFileAlt, FaTrashAlt, FaUserCog } from 'react-icons/fa';
import { FaChartLine, FaUserGraduate, FaUserTie, FaWallet } from 'react-icons/fa6';

export const CATEGORY_MENU_ITEMS = [{
  key: 'category',
  label: 'Category',
  icon: BsUiRadiosGrid,
  children: [{
    key: 'development',
    label: 'Development',
    parentKey: 'category',
    children: [{
      key: 'web-development',
      label: 'Web Development',
      parentKey: 'development',
      children: [{
        key: 'css',
        label: 'CSS',
        parentKey: 'web-development'
      }, {
        key: 'javaScript',
        label: 'JavaScript',
        parentKey: 'web-development'
      }, {
        key: 'angular',
        label: 'Angular',
        parentKey: 'web-development'
      }, {
        key: 'php',
        label: 'PHP',
        parentKey: 'web-development'
      }, {
        key: 'html',
        label: 'HTML',
        parentKey: 'web-development'
      }, {
        key: 'react',
        label: 'React',
        parentKey: 'web-development'
      }]
    }, {
      key: 'data-science',
      label: 'Data Science',
      parentKey: 'development'
    }, {
      key: 'mobile-development',
      label: 'Mobile Development',
      parentKey: 'development'
    }, {
      key: 'programming-language',
      label: 'Programming Language',
      parentKey: 'development'
    }, {
      key: 'software-testing',
      label: 'Software Testing',
      parentKey: 'development'
    }, {
      key: 'software-engineering',
      label: 'Software Engineering',
      parentKey: 'development'
    }, {
      key: 'software-development-tools',
      label: 'Software Engineering',
      parentKey: 'development'
    }]
  }, {
    key: 'design',
    label: 'Design',
    parentKey: 'category',
    isMegaMenu: true
  }, {
    key: 'music',
    label: 'Music',
    parentKey: 'category'
  }, {
    key: 'lifestyle',
    label: 'Lifestyle',
    parentKey: 'category'
  }, {
    key: 'it-software',
    label: 'It & Software',
    parentKey: 'category'
  }, {
    key: 'personal-development',
    label: 'Personal Development',
    parentKey: 'category'
  }, {
    key: 'health-fitness',
    label: 'Health & fitness',
    parentKey: 'category'
  }, {
    key: 'teaching',
    label: 'Teaching',
    parentKey: 'category'
  }, {
    key: 'social-science',
    label: 'Social science',
    parentKey: 'category'
  }, {
    key: 'math-logic',
    label: 'Math & Logic',
    parentKey: 'category'
  }]
}];
export const INSTRUCTOR_MENU_ITEMS = [{
  key: 'dashboard',
  label: 'Dashboard',
  icon: BsUiChecksGrid,
  url: '/instructor/dashboard',
  parentKey: 'instructor'
}, {
  key: 'courses',
  label: 'My Courses',
  icon: BsBasket,
  url: '/instructor/manage-course',
  parentKey: 'instructor'
}, {
  key: 'quiz',
  label: 'Quiz',
  icon: BsQuestionDiamond,
  url: '/instructor/quiz',
  parentKey: 'instructor'
}, {
  key: 'earnings',
  label: 'Earnings',
  icon: BsGraphUp,
  url: '/instructor/earning',
  parentKey: 'instructor'
}, {
  key: 'students',
  label: 'Students',
  icon: BsPeople,
  url: '/instructor/student-list',
  parentKey: 'instructor'
}, {
  key: 'orders',
  label: 'Orders',
  icon: BsFolderCheck,
  url: '/instructor/order',
  parentKey: 'instructor'
}, {
  key: 'reviews',
  label: 'Reviews',
  icon: BsStar,
  url: '/instructor/review',
  parentKey: 'instructor'
}, {
  key: 'profile',
  label: 'Edit Profile',
  icon: BsPencilSquare,
  url: '/instructor/edit-profile',
  parentKey: 'instructor'
}, {
  key: 'payout',
  label: 'Payout',
  icon: BsWallet2,
  url: '/instructor/payout',
  parentKey: 'instructor'
}, {
  key: 'setting',
  label: 'Setting',
  icon: BsGear,
  url: '/instructor/setting',
  parentKey: 'instructor'
}, {
  key: 'delete',
  label: 'Delete Profile',
  icon: BsTrash,
  url: '/instructor/delete-account',
  parentKey: 'instructor'
}];
export const STUDENT_MENU_ITEMS = [{
  key: 'dashboard',
  label: 'Dashboard',
  icon: BsUiChecksGrid,
  url: '/student/dashboard',
  parentKey: 'student'
}, {
  key: 'courses',
  label: 'My Courses',
  icon: BsBasket,
  url: '/student/course-list',
  parentKey: 'student'
}, {
  key: 'resume',
  label: 'Course Resume',
  icon: FaRegFileAlt,
  url: '/student/course-resume',
  parentKey: 'student'
}, 
 {
  key: 'resume',
  label: 'My certificate',
  icon: FaRegFileAlt,
  url: '/student/subscription',
  parentKey: 'student'
},  {
  key: 'profile',
  label: 'Edit Profile',
  icon: BsPencilSquare,
  url: '/student/edit-profile',
  parentKey: 'student'
}, {
  key: 'setting',
  label: 'Setting',
  icon: BsGear,
  url: '/student/setting',
  parentKey: 'student'
}, {
  key: 'delete',
  label: 'Delete Profile',
  icon: BsTrash,
  url: '/student/delete-account',
  parentKey: 'student'
}

];
export const APP_MENU_ITEMS = [
  {
    key: 'default',
    label: 'Home',
    url: '/home'
  },
  {
    key: 'gridClassic',
    label: 'Course',
    url: '/pages/course/grid'
  },
  {
    key: 'aboutUs',
    label: 'About Us',
    url: '/pages/about/about-us'
  },
  {
    key: 'contactUs',
    label: 'Contact Us',
    url: '/pages/about/contact-us'
  },
{
      key: 'signIn',
      label: 'Sign In',
      url: '/auth/sign-in',
      parentKey: 'authentication'
    }, {
      key: 'signUp',
      label: 'Sign Up',
      url: '/auth/sign-up',
      parentKey: 'authentication'
    }
];

export const ADMIN_MENU_ITEMS = [{
  key: 'admin',
  label: 'Dashboard',
  icon: BsHouse,
  url: '/admin/dashboard'
}, {
  key: 'courses',
  label: 'Courses',
  icon: BsBasket,
  children: [{
    key: 'all-courses',
    label: 'All Courses',
    parentKey: 'courses',
    url: '/admin/all-courses'
  }, {
    key: 'course-category',
    label: 'Course Category',
    url: '/admin/course-category',
    parentKey: 'courses'
  }]
}, {
  key: 'students',
  label: 'Students',
  icon: FaUserGraduate,
  url: '/admin/students'
},  {
  key: 'reviews',
  label: 'Reviews',
  icon: FaRegCommentDots,
  url: '/admin/reviews'
}, {
  key: 'earnings',
  label: 'Earnings',
  icon: FaChartBar,
  url: '/admin/earnings'
}, {
  key: 'admin-settings',
  label: 'Admin Settings',
  icon: FaUserCog,
  url: '/admin/admin-settings'
}];
