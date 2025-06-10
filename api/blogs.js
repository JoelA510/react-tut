// In api/blogs.js

import fs from 'fs';
import path from 'path';

// Helper function to get the full path to our db.json file
function getDbPath() {
  // process.cwd() gives the project's root directory
  return path.join(process.cwd(), 'data', 'db.json');
}

export default function handler(req, res) {
  const dbPath = getDbPath();

  try {
    const fileContents = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(fileContents);

    // Handle GET requests
    if (req.method === 'GET') {
      // Check for an ID in the query string, e.g., /api/blogs?id=1
      const { id } = req.query;
      if (id) {
        const blog = data.blogs.find(b => b.id == id);
        if (blog) {
          res.status(200).json(blog);
        } else {
          res.status(404).json({ message: 'Blog not found' });
        }
      } else {
        // No ID, return all blogs
        res.status(200).json(data.blogs);
      }
    } 
    // Handle POST requests
    else if (req.method === 'POST') {
      const newBlog = {
        id: Date.now(), // Simple unique ID
        ...req.body
      };
      data.blogs.push(newBlog);
      // IMPORTANT: Vercel has a read-only filesystem, except for /tmp.
      // This write operation will work locally but not on a deployed Vercel server.
      // For a tutorial, this is a known limitation. For a real app, use a database.
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      res.status(201).json(newBlog);
    }
    // Handle DELETE requests
    else if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: 'Blog ID is required' });
        }
        const blogIndex = data.blogs.findIndex(b => b.id == id);
        if (blogIndex === -1) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        data.blogs = data.blogs.filter(b => b.id != id);
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        res.status(200).json({ message: 'Blog deleted successfully' });
    }
    // Handle other methods
    else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong on the server.' });
  }
}