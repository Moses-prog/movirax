import { getTrending, popularMovies, nowPlayingMovies, upcomingMovies, topRatedMovies, discoverMovies, popularTvShows, airingTodayTvShows, onTheAirTvShows, topRatedTvShows, discoverTvShows } from "@/actions/tmdb";

import { SiteConfigType } from "@/types";
import { BiSearchAlt2, BiSolidSearchAlt2 } from "react-icons/bi";
import { GoHomeFill, GoHome } from "react-icons/go";
import { HiComputerDesktop } from "react-icons/hi2";
import { IoIosSunny } from "react-icons/io";
import {
  IoCompass,
  IoCompassOutline,
  IoInformationCircle,
  IoInformationCircleOutline,
  IoMoon,
} from "react-icons/io5";
import { TbFolder, TbFolderFilled } from "react-icons/tb";

export const siteConfig: SiteConfigType = {
  name: "MoviraX",
  description: "Your only choice for a free movies and tv shows streaming website.",
  favicon: "/favicon.ico",
  ogImage: "/moviraxlogo.png",
  navItems: [
    {
      label: "Home",
      href: "/",
      icon: <GoHome className="size-full" />,
      activeIcon: <GoHomeFill className="size-full" />,
    },
    {
      label: "Discover",
      href: "/discover",
      icon: <IoCompassOutline className="size-full" />,
      activeIcon: <IoCompass className="size-full" />,
    },
    {
      label: "Search",
      href: "/search",
      icon: <BiSearchAlt2 className="size-full" />,
      activeIcon: <BiSolidSearchAlt2 className="size-full" />,
    },
    {
      label: "Library",
      href: "/library",
      icon: <TbFolder className="size-full" />,
      activeIcon: <TbFolderFilled className="size-full" />,
    },
    {
      label: "About",
      href: "/about",
      icon: <IoInformationCircleOutline className="size-full" />,
      activeIcon: <IoInformationCircle className="size-full" />,
    },
  ],
  themes: [
    // {
    //   name: "light",
    //   icon: <IoIosSunny className="size-full" />,
    // },
    {
      name: "dark",
      icon: <IoMoon className="size-full" />,
    },
    // {
    //   name: "system",
    //   icon: <HiComputerDesktop className="size-full" />,
    // },
  ],
  queryLists: {
    movies: [
      {
        name: "Today's Trending Movies",
        query: (page = 1) => getTrending("movie", "day", page) as any,
        param: "todayTrending",
      },
      {
        name: "This Week's Trending Movies",
        query: (page = 1) => getTrending("movie", "week", page) as any,
        param: "thisWeekTrending",
      },
      {
        name: "Popular Movies",
        query: (page = 1) => popularMovies(page),
        param: "popular",
      },
      {
        name: "Now Playing Movies",
        query: (page = 1) => nowPlayingMovies(page),
        param: "nowPlaying",
      },
      {
        name: "Upcoming Movies",
        query: (page = 1) => upcomingMovies(page),
        param: "upcoming",
      },
      {
        name: "Top Rated Movies",
        query: (page = 1) => topRatedMovies(page),
        param: "topRated",
      },
      { name: "Action Movies", query: (page = 1) => discoverMovies(page, "28", "popularity.desc"), param: "genre-28" },
      { name: "Adventure Movies", query: (page = 1) => discoverMovies(page, "12", "popularity.desc"), param: "genre-12" },
      { name: "Animation Movies", query: (page = 1) => discoverMovies(page, "16", "popularity.desc"), param: "genre-16" },
      { name: "Comedy Movies", query: (page = 1) => discoverMovies(page, "35", "popularity.desc"), param: "genre-35" },
      { name: "Crime Movies", query: (page = 1) => discoverMovies(page, "80", "popularity.desc"), param: "genre-80" },
      { name: "Documentary Movies", query: (page = 1) => discoverMovies(page, "99", "popularity.desc"), param: "genre-99" },
      { name: "Drama Movies", query: (page = 1) => discoverMovies(page, "18", "popularity.desc"), param: "genre-18" },
      { name: "Family Movies", query: (page = 1) => discoverMovies(page, "10751", "popularity.desc"), param: "genre-10751" },
      { name: "Fantasy Movies", query: (page = 1) => discoverMovies(page, "14", "popularity.desc"), param: "genre-14" },
      { name: "History Movies", query: (page = 1) => discoverMovies(page, "36", "popularity.desc"), param: "genre-36" },
      { name: "Horror Movies", query: (page = 1) => discoverMovies(page, "27", "popularity.desc"), param: "genre-27" },
      { name: "Music Movies", query: (page = 1) => discoverMovies(page, "10402", "popularity.desc"), param: "genre-10402" },
      { name: "Mystery Movies", query: (page = 1) => discoverMovies(page, "9648", "popularity.desc"), param: "genre-9648" },
      { name: "Romance Movies", query: (page = 1) => discoverMovies(page, "10749", "popularity.desc"), param: "genre-10749" },
      { name: "Science Fiction Movies", query: (page = 1) => discoverMovies(page, "878", "popularity.desc"), param: "genre-878" },
      { name: "Thriller Movies", query: (page = 1) => discoverMovies(page, "53", "popularity.desc"), param: "genre-53" },
      { name: "War Movies", query: (page = 1) => discoverMovies(page, "10752", "popularity.desc"), param: "genre-10752" },
      { name: "Western Movies", query: (page = 1) => discoverMovies(page, "37", "popularity.desc"), param: "genre-37" },

                                                                                                                ],
    tvShows: [
      {
        name: "Today's Trending TV Shows",
        query: (page = 1) => getTrending("tv", "day", page) as any,
        param: "todayTrending",
      },
      {
        name: "This Week's Trending TV Shows",
        query: (page = 1) => getTrending("tv", "week", page) as any,
        param: "thisWeekTrending",
      },
      {
        name: "Popular TV Shows",
        
        query: (page = 1) => popularTvShows(page),
        param: "popular",
      },
      {
        name: "On The Air TV Shows",
        
        query: (page = 1) => onTheAirTvShows(page),
        param: "onTheAir",
      },
      {
        name: "Top Rated TV Shows",
        
        query: (page = 1) => topRatedTvShows(page),
        param: "topRated",
      },
      { name: "Action & Adventure TV", query: (page = 1) => discoverTvShows(page, "10759", "vote_count.desc"), param: "genre-10759" },
      { name: "Animation TV", query: (page = 1) => discoverTvShows(page, "16", "vote_count.desc"), param: "genre-16" },
      { name: "Comedy TV", query: (page = 1) => discoverTvShows(page, "35", "vote_count.desc"), param: "genre-35" },
      { name: "Crime TV", query: (page = 1) => discoverTvShows(page, "80", "vote_count.desc"), param: "genre-80" },
      { name: "Documentary TV", query: (page = 1) => discoverTvShows(page, "99", "vote_count.desc"), param: "genre-99" },
      { name: "Drama TV", query: (page = 1) => discoverTvShows(page, "18", "vote_count.desc"), param: "genre-18" },
      { name: "Family TV", query: (page = 1) => discoverTvShows(page, "10751", "vote_count.desc"), param: "genre-10751" },
      { name: "Kids TV", query: (page = 1) => discoverTvShows(page, "10762", "vote_count.desc"), param: "genre-10762" },
      { name: "Mystery TV", query: (page = 1) => discoverTvShows(page, "9648", "vote_count.desc"), param: "genre-9648" },
      { name: "Sci-Fi & Fantasy TV", query: (page = 1) => discoverTvShows(page, "10765", "vote_count.desc"), param: "genre-10765" },
      { name: "War & Politics TV", query: (page = 1) => discoverTvShows(page, "10768", "vote_count.desc"), param: "genre-10768" },
      { name: "Western TV", query: (page = 1) => discoverTvShows(page, "37", "vote_count.desc"), param: "genre-37" },

                                                                            ],
  },
  socials: {
    github: "https://github.com/wisnuwirayuda15/cinextma",
  },
};

export type SiteConfig = typeof siteConfig;
