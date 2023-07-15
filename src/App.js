// import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import axios from 'axios';


import { BrowserRouter as Router, Route} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar"
import ReadPosts from "./components/ReadPost";
import EditPost from "./components/EditPost";
import CreatePost from "./components/CreatePost";
import DisplayPosts from "./components/Display";
import TextAnalyzer from "./TextAnalyzer";
import WriteOut from "./components/WriteOut";


import { Link } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'


const App = () => {

  const descr = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get('http://localhost:5000/posts/');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchPosts();
  }, []);



  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element: <ReadPosts data={posts} />
    },
    {
      path: "/edit/:id",
      element: <EditPost data={posts} />
    },
    {
      path: "/display/:id",
      element: <DisplayPosts data={posts} />

    },
    {
      path: "/analyzer",
      element: <TextAnalyzer/>
    },
    {
      path: "/write",
      element: <WriteOut/>
    },
    {
      path: "/new",
      element: <CreatePost />
    }
  ]);

  return (

    <div className="App">
      <Navbar />

      {/* <div className="header">
       

      </div> */}
      {element}
    </div>

  );
}

export default App;
