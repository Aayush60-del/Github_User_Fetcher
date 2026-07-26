import { useState, useEffect } from "react";
import githubIcon from "./assets/github.svg";
import "./App.css";

function App() {
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");

  const [data, setData] = useState({});
  const [Repo, setRepo] = useState([]);
  const [showImg , setShowImg] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  const handleSearch = (username = user) => {
    if (username.trim() === "") {
      setShowImg(false);
      return;
    }

    setUser(username);
    setSearch(username);
  };

  return (
    <div className={`app-shell${darkMode ? " theme-dark" : ""}`}>
      <main className="app">
      <header className="masthead">
        <a className="wordmark" href="#search">
          <span className="wordmark-mark"><img src={githubIcon} alt="" /></span>
          <span>git dossier</span>
        </a>
        <div className="masthead-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-pressed={darkMode}
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => setDarkMode(!darkMode)}
          >
            <span aria-hidden="true">{darkMode ? "☀" : "◐"}</span>
            {darkMode ? "Light" : "Dark"}
          </button>
          <p className="masthead-note"><span /> Public work, indexed.</p>
        </div>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="kicker">A field guide to GitHub profiles</p>
        <h1 id="page-title">Every commit leaves<br />a trail.</h1>
        <p className="intro-copy">Search a username to open a compact record of their public profile and repository shelf.</p>
      </section>

      <section className="search-panel" id="search" aria-label="Search GitHub users">
        <div className="search-ruler" aria-hidden="true"><span>LOOK UP</span><span>ENTER ↵</span></div>
        <div className="search-row">
          <label className="search-field">
            <span aria-hidden="true">@</span>
            <input
              type="text"
              placeholder="github username"
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </label>
          <button onClick={() => handleSearch()}>
            Open dossier <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="suggestion-row">
          <span>Friend on GitHub</span>
          <a
            className="friend-link"
            href="https://github.com/noEYEdeer0001"
            target="_blank"
            rel="noreferrer"
          >
            <span>noEYEdeer0001</span>
            <span className="friend-name">Hardikkhanduja</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      {showImg ? (
        <section className="dossier" aria-labelledby="profile-name">
          <div className="dossier-index" aria-hidden="true">
            <span>PROFILE</span>
            <span>01</span>
          </div>
          <div className="dossier-main">
            <img className="profile-avatar" src={data.Image} alt={search} />
            <div className="profile-info">
              <p className="profile-label">GitHub account</p>
              <h2 id="profile-name">{data.name}</h2>
              <p>{data.bio || "This developer has not added a profile bio yet."}</p>
              <a className="profile-link" href={data.Url} target="_blank" rel="noreferrer">
                Visit on GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="profile-stats" aria-label="Profile statistics">
            <div className="stat"><p>Followers</p><h3>{data.follower}</h3></div>
            <div className="stat"><p>Following</p><h3>{data.following}</h3></div>
            <div className="stat"><p>Repositories</p><h3>{data.count}</h3></div>
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <div className="empty-card">
            <span className="empty-index">00</span>
            <div>
              <p className="profile-label">Dossier unavailable</p>
              <h2>Who are we looking for?</h2>
              <p>Use the search field or choose a suggested profile to begin.</p>
            </div>
          </div>
          <p className="empty-caption">No sign-in. Only publicly available GitHub profile data.</p>
        </section>
      )}

      {showImg && Repo.length > 0 && (
        <section className="repositories-section" aria-labelledby="repositories-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Selected public work</p>
              <h2 id="repositories-title">Repository shelf</h2>
            </div>
            <span className="repo-count">{Repo.length} REPOS</span>
          </div>

          <div className="repository-container">
            {Repo.map((repo, index) => {
              return (
                <article className="repository-card" key={repo.id}>
                  <span className="repository-number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{repo.name}</h3>
                  <p>{repo.description || "No description available"}</p>
                  <a href={repo.html_url} target="_blank" rel="noreferrer">
                    Inspect repository <span aria-hidden="true">↗</span>
                  </a>
                </article>
              );
            })}
          </div>
        </section>
      )}
      </main>
    </div>
  );
}

export default App;
