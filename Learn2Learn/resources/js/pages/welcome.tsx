import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const whiteLogoImage = '/Learn2Learn_Logo_white.png';
    const blackLogoImage = '/Learn2Learn_Logo_black.png';
    const { auth } = usePage<SharedData>().props;
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#E0F2F1] text-[#263238] dark:bg-[#263238] dark:text-[#E0F2F1]">
                {/* Header */}
                <header className="flex w-full justify-between items-center  lg:px-12 bg-[#B2DFDB] text-[#263238] dark:bg-[#00796B] dark:text-[#E0F2F1]">
                    <div className="relative h-30 w-auto">
                        <img src={blackLogoImage} alt="Learn2Learn Logo" className="h-full w-auto dark:hidden"/>
                        <img src={whiteLogoImage} alt="Learn2Learn Logo" className="hidden h-full w-auto dark:block"/>
                    </div>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-sm border border-[#4DB6AC] px-5 py-1.5 text-sm text-[#263238] hover:bg-[#B2DFDB] dark:border-[#4DB6AC] dark:text-[#E0F2F1] dark:hover:bg-[#00796B]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-sm border border-transparent px-5 py-1.5 text-sm text-[#263238] hover:border-[#4DB6AC] dark:text-[#B2DFDB] dark:hover:border-[#4DB6AC]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-sm border border-[#4DB6AC] px-5 py-1.5 text-sm text-[#263238] hover:bg-[#B2DFDB] dark:border-[#4DB6AC] dark:text-[#E0F2F1] dark:hover:bg-[#00796B]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex flex-1 flex-col items-center justify-center text-center px-6 lg:px-12">
                    <h1 className='text-6xl md:text-8xl font-bold text-[#00796B] dark:text-[#4DB6AC]'>
                        Welcome to Learn2Learn
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#00796B] dark:text-[#4DB6AC] mt-12">
                        Discover Better Ways to Learn
                    </h2>
                    <p className="mt-4 text-lg text-[#263238] dark:text-[#B2DFDB]">
                        Explore proven learning methods, note-taking techniques, and get AI-powered suggestions to improve your study habits.
                    </p>
                    <Link
                        href={route('register')}
                        className="mt-6 inline-flex items-center justify-center rounded-md bg-[#00796B] px-6 py-3 text-sm font-medium text-[#E0F2F1] hover:bg-[#00695C] dark:bg-[#4DB6AC] dark:text-[#263238] dark:hover:bg-[#5DC6BC]"
                    >
                        Get Started →
                    </Link>
                </main>

                {/* Footer */}
                <footer className="w-full bg-[#B2DFDB] text-[#263238] dark:bg-[#00796B] dark:text-[#E0F2F1] py-4 px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                        <span className="text-sm font-medium">© 2025 Learn2Learn. All rights reserved.</span>
                        <nav className="flex items-center gap-4 text-sm">
                            <Link href="#" className="hover:underline hover:text-[#00796B] dark:hover:text-[#B2DFDB]">
                                Privacy
                            </Link>
                            <Link href="#" className="hover:underline hover:text-[#00796B] dark:hover:text-[#B2DFDB]">
                                Terms
                            </Link>
                            <Link href="#" className="hover:underline hover:text-[#00796B] dark:hover:text-[#B2DFDB]">
                                Contact
                            </Link>
                        </nav>
                    </div>
                </footer>
            </div>
        </>
    );
}