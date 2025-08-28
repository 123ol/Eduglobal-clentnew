import Footer from '@/components/Footer';
import { getBlogById } from '@/helpers/data';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlogInfo from './components/BlogInfo';
import RelatedBlogs from './components/RelatedBlogs';
import TopNavigationBar from './components/TopNavigationBar';
import PageMetaData from '@/components/PageMetaData';
const BlogDetails = () => {
  const [blog, setBlog] = useState();
  const {
    blogId
  } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    ;
    (async () => {
      if (blogId) {
        const data = await getBlogById(blogId);
        if (data) setBlog(data);else navigate('/error-404');
      }
    })();
  }, []);
  return <>
      <PageMetaData title={blog?.id ?? 'Blog Details'} />
      <TopNavigationBar />
      <main>
        {blog && <BlogInfo blog={blog} />}
        <RelatedBlogs />
      </main>
      <Footer className="bg-light" />
    </>;
};
export default BlogDetails;
