import BlogList from "./BlogList";
import useFetch from "./useFetch";
import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';

const Home = () => { 
  const { data: blogs, isPending, error } = useFetch('/api/blogs');
  const [blogs, setBlogs] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="home">
      { error && <div>{ error }</div> }
      { isPending && <div>Loading...</div> }
      { blogs && <BlogList blogs={blogs} title="All Blogs!" /> }
    </div>
  );
}

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select(); // '*' is default

      if (error) {
        setError('Could not fetch the blogs');
        setBlogs(null);
        console.error(error);
      }
      if (data) {
        setBlogs(data);
        setError(null);
      }
      setIsPending(false);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {blogs && <BlogList blogs={blogs} title="All Blogs!" />}
    </div>
  );
};
 
export default Home;