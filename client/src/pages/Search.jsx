import React, { useEffect, useState } from 'react'
import { Button, Select, Spinner, TextInput } from "flowbite-react"
import categories from "../util/Categories";
import { useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard';

const Search = () => {
    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    })

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();


    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSideBarData({ ...sideBarData, searchTerm: e.target.value })
        }

        if (e.target.id === 'desc') {
            const order = e.target.value || 'sort';
            setSideBarData({ ...sideBarData, sort: order })
        }
        if (e.target.id === 'category') {
            const selectedCategory = e.target.value || 'uncategorized';
            setSideBarData({ ...sideBarData, category: selectedCategory });
        }


    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromURL = urlParams.get('searchTerm') || '';
        const sortFromUrl = urlParams.get('sort') || 'desc';
        const categoryFormUrl = urlParams.get('category') || 'uncategorized';
    
        // Update state based on URL params
        setSideBarData({
            searchTerm: searchTermFromURL,
            sort: sortFromUrl,
            category: categoryFormUrl,
        });
    
        const fetchPosts = async () => {
            setLoading(true);
    
            // Remove empty filters from URL parameters
            if (!searchTermFromURL) urlParams.delete('searchTerm');
            if (!sortFromUrl || sortFromUrl === 'desc') urlParams.delete('sort');
            if (!categoryFormUrl || categoryFormUrl === 'uncategorized') urlParams.delete('category');
    
            const searchQuery = urlParams.toString();
            const endpoint = searchQuery ? `/api/post/getposts?${searchQuery}` : `/api/post/getposts`;
    
            const res = await fetch(endpoint);
            if (!res.ok) {
                setLoading(false);
                return;
            }
    
            const data = await res.json();
            setPosts(data.posts);
            setLoading(false);
            setShowMore(data.posts.length === 9);
        };
    
        fetchPosts();
    }, [location.search]);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sideBarData.searchTerm)
        urlParams.set('sort', sideBarData.sort)
        urlParams.set('category', sideBarData.category)
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)


    }
    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`)
        if (!res.ok) {
            return;
        }
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, data.posts])
            if (data.posts.length === 9) {
                setShowMore(true)

            } else {
                setShowMore(false)
            }
        }

    }

    console.log(sideBarData)
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <TextInput
                            placeholder='Search...'
                            id='searchTerm'
                            type='text'
                            value={sideBarData.searchTerm}
                            onChange={handleChange}
                        />

                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Sort:</label>
                        <Select onChange={handleChange} id='sort' value={sideBarData.sort}>
                            <option value='desc'>Latest</option>
                            <option value='asc'>oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Category:</label>
                        <Select onChange={handleChange} id='category' value={sideBarData.category}>
                            <option value='uncategorized'>UnCategorized</option>
                            {categories.map((category) => (
                                <option key={category.value}
                                    value={category.value} >
                                    {category.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <Button type='submit' ouline gradientDuoTone='purpleToPink'>Search</Button>
                </form>
            </div>
            <div className="w-full">
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
                    Posts results
                </h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && posts.length === 0 && (<p>
                        No Posts found.
                    </p>)}
                    {loading && (
                        <div className='flex justify-center items-center min-h-screen'><Spinner size='xl' /></div>
                    )}
                    {!loading && posts && posts.map((post) => (
                        <PostCard post={post} />
                    ))}
                    {showMore && <button className='text-teal-500 text-lg hover:underline w-full' onClick={handleShowMore}>Show more</button>}
                </div>
            </div>
        </div>
    )
}

export default Search
