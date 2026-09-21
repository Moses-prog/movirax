import { tmdb } from "@/api/tmdb";
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
        query: (page = 1) => tmdb.trending.trending("movie", "day", { page }),
        param: "todayTrending",
      },
      {
        name: "This Week's Trending Movies",
        query: (page = 1) => tmdb.trending.trending("movie", "week", { page }),
        param: "thisWeekTrending",
      },
      {
        name: "Popular Movies",
        query: (page = 1) => tmdb.movies.popular({ page }),
        param: "popular",
      },
      {
        name: "Now Playing Movies",
        query: (page = 1) => tmdb.movies.nowPlaying({ page }),
        param: "nowPlaying",
      },
      {
        name: "Upcoming Movies",
        query: (page = 1) => tmdb.movies.upcoming({ page }),
        param: "upcoming",
      },
      {
        name: "Top Rated Movies",
        query: (page = 1) => tmdb.movies.topRated({ page }),
        param: "topRated",
      },
      { name: "Action Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '28', sort_by: 'popularity.desc', page }), param: "genre-28" },
      { name: "Adventure Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '12', sort_by: 'popularity.desc', page }), param: "genre-12" },
      { name: "Animation Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '16', sort_by: 'popularity.desc', page }), param: "genre-16" },
      { name: "Comedy Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '35', sort_by: 'popularity.desc', page }), param: "genre-35" },
      { name: "Crime Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '80', sort_by: 'popularity.desc', page }), param: "genre-80" },
      { name: "Documentary Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '99', sort_by: 'popularity.desc', page }), param: "genre-99" },
      { name: "Drama Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '18', sort_by: 'popularity.desc', page }), param: "genre-18" },
      { name: "Family Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '10751', sort_by: 'popularity.desc', page }), param: "genre-10751" },
      { name: "Fantasy Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '14', sort_by: 'popularity.desc', page }), param: "genre-14" },
      { name: "History Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '36', sort_by: 'popularity.desc', page }), param: "genre-36" },
      { name: "Horror Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '27', sort_by: 'popularity.desc', page }), param: "genre-27" },
      { name: "Music Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '10402', sort_by: 'popularity.desc', page }), param: "genre-10402" },
      { name: "Mystery Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '9648', sort_by: 'popularity.desc', page }), param: "genre-9648" },
      { name: "Romance Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '10749', sort_by: 'popularity.desc', page }), param: "genre-10749" },
      { name: "Science Fiction Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '878', sort_by: 'popularity.desc', page }), param: "genre-878" },
      { name: "Thriller Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '53', sort_by: 'popularity.desc', page }), param: "genre-53" },
      { name: "War Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '10752', sort_by: 'popularity.desc', page }), param: "genre-10752" },
      { name: "Western Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: '37', sort_by: 'popularity.desc', page }), param: "genre-37" },

                                                                                                                ],
    tvShows: [
      {
        name: "Today's Trending TV Shows",
        query: (page = 1) => tmdb.trending.trending("tv", "day", { page }),
        param: "todayTrending",
      },
      {
        name: "This Week's Trending TV Shows",
        query: (page = 1) => tmdb.trending.trending("tv", "week", { page }),
        param: "thisWeekTrending",
      },
      {
        name: "Popular TV Shows",
        // @ts-expect-error: Property 'adult' is missing in type 'PopularTvShowResult' but required in type 'TV'.
        query: (page = 1) => tmdb.tvShows.popular({ page }),
        param: "popular",
      },
      {
        name: "On The Air TV Shows",
        // @ts-expect-error: Property 'adult' is missing in type 'OnTheAirResult' but required in type 'TV'.
        query: (page = 1) => tmdb.tvShows.onTheAir({ page }),
        param: "onTheAir",
      },
      {
        name: "Top Rated TV Shows",
        // @ts-expect-error:
        query: (page = 1) => tmdb.tvShows.topRated({ page }),
        param: "topRated",
      },
      { name: "Action & Adventure TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '10759', sort_by: 'vote_count.desc', page }), param: "genre-10759" },
      { name: "Animation TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '16', sort_by: 'vote_count.desc', page }), param: "genre-16" },
      { name: "Comedy TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '35', sort_by: 'vote_count.desc', page }), param: "genre-35" },
      { name: "Crime TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '80', sort_by: 'vote_count.desc', page }), param: "genre-80" },
      { name: "Documentary TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '99', sort_by: 'vote_count.desc', page }), param: "genre-99" },
      { name: "Drama TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '18', sort_by: 'vote_count.desc', page }), param: "genre-18" },
      { name: "Family TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '10751', sort_by: 'vote_count.desc', page }), param: "genre-10751" },
      { name: "Kids TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '10762', sort_by: 'vote_count.desc', page }), param: "genre-10762" },
      { name: "Mystery TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '9648', sort_by: 'vote_count.desc', page }), param: "genre-9648" },
      { name: "Sci-Fi & Fantasy TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '10765', sort_by: 'vote_count.desc', page }), param: "genre-10765" },
      { name: "War & Politics TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '10768', sort_by: 'vote_count.desc', page }), param: "genre-10768" },
      { name: "Western TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: '37', sort_by: 'vote_count.desc', page }), param: "genre-37" },

                                                                            ],
  },
  socials: {
    github: "https://github.com/wisnuwirayuda15/cinextma",
  },
};

export type SiteConfig = typeof siteConfig;
