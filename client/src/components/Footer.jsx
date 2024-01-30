import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import {BsInstagram ,BsGithub ,BsLinkedin} from "react-icons/bs"

export default function Footerpage() {
  return (
    <Footer container className='border border-t-8 border-teal-300'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                <div className='mt-5'>
                    <Link to={'/'} className={'self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'}>
                        <span className='px-2 py-1 bg-gradient-to-r from-sky-500 via-slate-500 to-fuchsia-500 rounded-lg text-white'>ML4BQ1_</span>
                        Blog
                    </Link>
                </div>

                <div className='grid grid-cols-2 gap-8 mt-5 sm:grid-cols-3'>
                    <div>
                        <Footer.Title title="About" />
                        <Footer.LinkGroup col>
                            <Footer.Link href="/about">
                                ML4BQ1_ Blog
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    <div>
                        <Footer.Title title="Follow us" />
                        <Footer.LinkGroup col>
                            <Footer.Link href="https://github.com/Mohammadiqbalmaulana2001" target='_blank'>
                                Github
                            </Footer.Link>
                            <Footer.Link href="https://www.linkedin.com/in/mohammad-iqbal-maulana-91917b253/" target='_blank'>
                                Linkend
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    <div>
                        <Footer.Title title="Legal" />
                        <Footer.LinkGroup col>
                            <Footer.Link href="#">
                                privacy Policy
                            </Footer.Link>
                            <Footer.Link href="#">
                                Terms &amp; Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider />
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
                <Footer.Copyright
                    href="#"
                    by=' ML4BQ1_ Blog'
                    year={new Date().getFullYear()}
                />

                <div className='flex gap-6 sm:mt-0 justify-end sm:justify-center'>
                    <Footer.Icon href='' icon={BsInstagram}/>
                    <Footer.Icon href='' icon={BsGithub}/>
                    <Footer.Icon href='' icon={BsLinkedin}/>
                </div>
            </div>
        </div>
    </Footer>
  )
}

