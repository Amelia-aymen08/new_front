import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const STRAPI_URL = config.STRAPI_URL;

export interface BlogImageFormat {
  url: string;
}

export interface BlogImage {
  data: {
    attributes: {
      url: string;
      formats: {
        medium?: BlogImageFormat;
        small?: BlogImageFormat;
        thumbnail?: BlogImageFormat;
      };
    };
  };
}

export interface BlogPost {
  id: number;
  attributes: {
    titre: string;
    slug: string;
    description: string;
    date: string;
    auteur: string;
    category: string;
    mignature_image: BlogImage;
  };
}

export function useBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${STRAPI_URL}/api/blogs?populate=*&sort[0]=date:desc&pagination[pageSize]=100`);
        setBlogs(response.data.data);
      } catch (err) {
        setError('Failed to fetch blogs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return { blogs, loading, error };
}
