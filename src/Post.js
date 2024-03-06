import React from 'react'
import { Link } from 'react-router-dom'

const Post = ({post}) => {
  return (
    <article className ="post" >
        <Link to = {`post/${post.id}`}>
          <h2>{post.title}</h2>
          <p className='postDate'>{post.datetime}</p>
        </Link>
          <p className='postBody'>  {(post.body && post.body.length <= 20) ? post.body :
          ((post.body && post.body.slice(0, 20)) ? `${post.body.slice(0, 20)}...` : '')
        }
         </p>
    </article>
  )
}

export default Post