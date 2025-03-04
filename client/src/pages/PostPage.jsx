import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react'
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
const PostPage = () => {
    const { postslug } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(false); // Reset error before fetching new data  

                const res = await fetch(`/api/post/getposts?slug=${postslug}`);

                if (!res.ok) {
                    throw new Error(`Failed to fetch post: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                console.log("DATA:", data);

                setPost(data.posts[0]);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postslug]);

    if (loading) return <div className='flex justify-center items-center min-h-screen'><Spinner size='xl' /></div>;
    if (error) return <div className='flex justify-center items-center min-h-screen'>Error loading post.</div>;

    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            {post ? <h1 className='text-3xl mt-10 text-center p-3 font-serif max-w-2xl mx-auto lg:text-4xl'>{post.title}</h1> : <p>Post not found.</p>}
            <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
                <Button color='gray' pill size='xs'>
                    {post && post.category}
                </Button>
            </Link>
            <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs '>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>

            </div>
            <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}>

            </div>
            <div className='max-w-4xl mx-auto w-full'>
                <CallToAction/>
            </div>
            <CommentSection postId={post && post._id}/>
        </main>
    );
};

export default PostPage;
