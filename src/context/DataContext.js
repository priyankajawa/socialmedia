import { createContext ,useState ,useEffect } from "react";
import api from "../api/posts";
import {format} from "date-fns";
import useWindowSize from "../hooks/useWindowSize";
import useAxiosFetch from "../hooks/useAxiosFetch";
import {useNavigate } from 'react-router-dom';


const DataContext = createContext({})

export const DataProvider = ({children}) => {
    
  const [posts ,setPosts] = useState([])
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const navigate = useNavigate();
  const {width} = useWindowSize()
  const {data ,fetchError ,isLoading} = useAxiosFetch('http://localhost:3500/posts');


  useEffect(() => {
    setPosts(data);
  } ,[data])

  useEffect (() => {
    const fetchPosts = async() => {
      try{
        const response = await api.get('/posts');
        setPosts(response.data);
      }catch (err){
        if(err.response){
        console.log(err.response.data) ; 
        console.log(err.response.status);
        console.log(err.response.headers);
      }
      else{
        console.log(`Error : ${err.message}`);
      }
      }
    }
    
    fetchPosts();
    } , [])

  useEffect( () =>{
    const filteredResults = posts.filter((post) => 
    ((post.body).toLocaleLowerCase()).includes(search.toLocaleLowerCase())
    || ((post.title).toLocaleLowerCase()).includes(search.toLocaleLowerCase()));

    setSearchResults(filteredResults.reverse());
  }, [posts, search]

  )

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };


    try {
        const response = await api.post('/posts', newPost);
        const addedPost = response.data;
        const updatedPosts = [addedPost, ...posts]; // Add the new post to the existing posts
        setPosts(updatedPosts);
        setPostTitle("");
        setPostBody("");
        navigate("/");
    } catch (err) {
        console.log(`Error : ${err.message}`);
    }
}

const handleEdit = async (id) => {
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const updatedPost = { title: editTitle, datetime, body: editBody };

    try {
        const response = await api.put(`/posts/${id}`, updatedPost);
        const updatedPostData = response.data;
        const updatedPosts = posts.map(post => post.id === id ? updatedPostData : post);
        setPosts(updatedPosts);
        setEditTitle("");
        setEditBody("");
        navigate("/");
    } catch (err) {
        console.log(`Error : ${err.message}`);
    }
}

const handleDelete = async (id) => {
    try {
        await api.delete(`/posts/${id}`);
        const updatedPosts = posts.filter(post => post.id !== id);
        setPosts(updatedPosts);
        navigate("/");
    } catch (err) {
        console.log(`Error : ${err.message}`);
    }
}
    return (
        <DataContext.Provider value ={{ 
            width,search,setSearch,searchResults ,fetchError ,isLoading,handleSubmit ,postTitle ,setPostTitle ,postBody ,setPostBody,handleDelete,posts ,handleEdit,editBody , setEditBody ,editTitle,setEditTitle,
        }}>
            {children}
        </DataContext.Provider>
    )
}
export default DataContext;