import { Footer,FooterIcon } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsX } 
from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";

const FooterComponent = () => {
    return (
        <Footer container className='border-t-2 border-teal-500'>
            <div className=' w-full max-w-7xl mx-auto'>
                <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                    <div className='mt-5 mb-3'>
                        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Noor's</span>
                            Blog
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6'>
                        <div>

                            <Footer.Title title='About' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='/' target='_blank' rel='noopener noreferrer'>
                                    100Js projects
                                </Footer.Link>
                                <Footer.Link href='/' target='_blank' rel='noopener noreferrer'>
                                    Noor's Blog
                                </Footer.Link>

                            </Footer.LinkGroup>
                        </div>

                        <div>

                            <Footer.Title title='Follow Us' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='https/github.com' target='_blank' rel='noopener noreferrer'>
                                    Github
                                </Footer.Link>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                    LinkedIn
                                </Footer.Link>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                    Discord
                                </Footer.Link>

                            </Footer.LinkGroup>
                        </div>
                        <div>

                            <Footer.Title title='Legal' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                    Pricavy policy
                                </Footer.Link>
                                <Footer.Link href='/' target='_blank' rel='noopener noreferrer'>
                                    Terms and conditions
                                </Footer.Link>

                            </Footer.LinkGroup>
                        </div>

                    </div>
                </div>
                <Footer.Divider/>
                    <div className='w-full sm:flex sm:items-center sm:justify-between'>
                        <Footer.Copyright href='#'  by="Noor's Blog" year={new Date().getFullYear()}/>
                        <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                            <Footer.Icon href='#' icon={BsFacebook}/>
                            <Footer.Icon href='#' icon={BsInstagram}/>
                            <Footer.Icon href='#' icon={FaXTwitter}/>
                            <Footer.Icon href='#' icon={BsGithub}/>
                            <Footer.Icon href='#' icon={BsDribbble}/>
                        </div>
                    </div>
                
            </div>
        </Footer>
    )
}

export default FooterComponent
