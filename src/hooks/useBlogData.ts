import { useState, useEffect } from 'react';
import axios from 'axios';
import { BlogResponse, BlogData } from '../types/blog';
import config from '../config';

const STRAPI_URL = config.STRAPI_URL;

export function useBlogData(slug: string | undefined) {
  const [data, setData] = useState<{ data: BlogData } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const response = await axios.get<BlogResponse>(`${STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}&populate=*`);
        
        if (response.data.data && response.data.data.length > 0) {
          // Standard Strapi response for list is { data: [...] }
          // We take the first match since slug should be unique
          setData({ data: response.data.data[0] });
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        setError('Failed to fetch blog post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  return { data, loading, error };
}
