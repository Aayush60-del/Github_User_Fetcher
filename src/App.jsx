import { useState, useEffect } from "react";
import githubIcon from "./assets/github.svg";
import "./App.css";

function App() {
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");

  const [data, setData] = useState({});
  const [Repo, setRepo] = useState([]);
  const [showImg , setShowImg] = useState(false);

  useEffect(() => {
    if (search.trim() === "") {
      return;
    }

    async function nikal() {
      try {

        const response = await fetch(
          `https://api.github.com/users/${search}`
        );

        const resData = await response.json();

        const RepoData = await fetch(
          `https://api.github.com/users/${search}/repos`
        );

        const resRepo = await RepoData.json();

        setData({
          name: resData.login,
          Image: resData.avatar_url,
          bio: resData.bio,
          follower: resData.followers,
          following: resData.following,
          Url: resData.html_url,
          count: resRepo.length,
        });
        setShowImg(true);
        setRepo(resRepo);

      } catch (error) {
        console.log(error);
      }
    }

    nikal();

  }, [search]);

  return (
  <>
    <div className="app">

      <div className="app-header">
        <img
          className="github-icon"
          src={githubIcon}
          alt="Github"
        />

        <h1>GitHub User Finder</h1>
        <p>Search GitHub profiles and explore their repositories</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter GitHub Username..."
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
        />

        <button
          onClick={() => {
            if (user.trim() === "")
            {
              setShowImg(false); 
              return;
            }
            setSearch(user);
          }}
        >
          Search
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-header">

          {showImg ? (<img
            className="profile-avatar"
            src={data.Image}
            alt={search}
          />) : (" ")}

          <div className="profile-info">
            <h2>{data.name}</h2>
            <p>{data.bio}</p>
          </div>

        </div>

        <div className="profile-stats">

          <div className="stat">
            <h3>{data.follower}</h3>
            <p>Followers</p>
          </div>

          <div className="stat">
            <h3>{data.following}</h3>
            <p>Following</p>
          </div>

          <div className="stat">
            <h3>{data.count}</h3>
            <p>Repositories</p>
          </div>

        </div>

        <a
          className="profile-link"
          href={data.Url}
          target="_blank"
          rel="noreferrer"
        >
          View GitHub Profile ↗
        </a>
      </div>

      <h2 className="repositories-title">
        📦 Repositories
      </h2>

      <div className="repository-container">
        {Repo.map((repo) => {
          return (
            <div
              className="repository-card"
              key={repo.id}
            >
              <h3>{repo.name}</h3>

              <p>
                {repo.description ||
                  "No description available"}
              </p>

              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
              >
                View Repository ↗
              </a>
            </div>
          );
        })}
      </div>

    </div>
  </>
);
}

export default App;