import { useState, useRef } from "react";
import useSWR, { mutate } from "swr";
import fetch from "isomorphic-unfetch";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ReactMarkdown from "react-markdown";
import ListIsEmpty from "../vectors/ListIsEmpty";
import Bye from "../vectors/Bye";

async function auth(pwd) {
  const request = await fetch(
    "https://svrlss.now.sh/api/get/rec6X68HCPqeEXzJH",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pwd })
    }
  );

  if (request.ok) {
    const { valid } = await request.json();

    return valid;
  }

  return false;
}

const Home = props => {
  const entry = useRef();
  const [authed, setAuthed] = useState();
  const [rating, setRating] = useState(1);
  const { data: entries } = useSWR(
    "/api/entries",
    route => fetch(route).then(r => r.ok && r.json()),
    { initialData: props.entries }
  );

  const login = async event => {
    event.preventDefault();

    const { pwd } = event.target.elements;

    setAuthed(await auth(pwd.value));
  };

  const add = async () => {
    if (!authed) return;

    console.log(rating, entry.current);

    const request = await fetch("/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating,
        entry: entry.current.value
      })
    });

    await mutate("/api/entries", [
      ...entries,
      { _id: "temp", date: Date.now(), rating, entry: entry.current.value }
    ]);

    mutate("/api/entries", request);

    entry.current && (entry.current.value = "");
  };

  return (
    <>
      <div className="add-entry">
        {!authed && (
          <div className="entry__auth">
            <div className="background" />
            <form className="auth__form" onSubmit={login}>
              <TextField label="Password" name="pwd" type="password" />
              <Button
                variant="contained"
                style={{ marginTop: "1rem" }}
                type="submit"
              >
                Authorize
              </Button>
            </form>
          </div>
        )}
        <TextField
          label="Write your ❤️ out"
          multiline
          rows="4"
          variant="filled"
          style={{ width: "100%" }}
          inputRef={entry}
        />
        <div>
          <Button variant="contained" disabled={!authed} onClick={add}>
            Save
          </Button>
          <IconButton onClick={() => setRating(-1)}>
            <ThumbDownIcon />
          </IconButton>
          <IconButton onClick={() => setRating(1)}>
            <ThumbUpIcon />
          </IconButton>
        </div>
      </div>
      <div className="entries">
        {entries.length < 1 ? (
          <div className="entries__empty">
            <h2>No entries here yet 🤕</h2>
            <ListIsEmpty style={{ maxHeight: "500px" }} />
          </div>
        ) : (
          <>
            {entries.map(entry => {
              return (
                <div className="entry" key={entry.id}>
                  <div className="entry__header">
                    <div className="entry__rating">
                      {entry.fields.rating === 1 ? (
                        <ThumbUpIcon />
                      ) : (
                        <ThumbDownIcon />
                      )}
                    </div>
                    <div className="entry__date">
                      {new Date(entry.fields.date).toLocaleString("en-CA", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                  <ReactMarkdown source={entry.fields.entry} />
                </div>
              );
            })}
            <div className="entries__empty">
              <h2>Thanks for reading 😃</h2>
              <p>
                Follow me on <a href="https://twitter.com/zealign">twitter</a>{" "}
                for updates
              </p>
              <Bye style={{ maxHeight: "500px", marginTop: "1rem" }} />
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .entries {
          padding: 2rem 1rem;
        }

        .entry {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          margin: 1rem 0;
          border-radius: var(--border-radius);
          box-shadow: 0 2.8px 13.8px rgba(0, 0, 0, 0.02),
            0 6.7px 33.3px rgba(0, 0, 0, 0.028),
            0 12.5px 62.6px rgba(0, 0, 0, 0.035),
            0 22.3px 111.7px rgba(0, 0, 0, 0.042),
            0 41.8px 208.9px rgba(0, 0, 0, 0.05),
            0 100px 500px rgba(0, 0, 0, 0.07);
        }

        .entry__header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .entry__rating {
          margin-right: 0.75rem;
        }

        .entry__date {
          font-size: 0.75rem;
        }

        .entries__empty {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .entry__auth {
          z-index: 1;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .entry__auth .background {
          background: rgba(0, 0, 0, 0.4);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .auth__form {
          background: var(--background);
          padding: 2rem 3rem;
          border-radius: var(--border-radius);
          display: flex;
          flex-direction: column;
          z-index: 1;
        }

        .add-entry {
          display: inline-flex;
          flex-direction: column;
          position: relative;
          border-radius: var(--border-radius);
          overflow: hidden;
          width: 100%;
          padding: 1rem;
        }
      `}</style>
    </>
  );
};

Home.getInitialProps = async ctx => {
  let uri;

  if (process.browser) {
    uri = new URL(location.href).origin;
  } else {
    uri = `${process.env.NODE_ENV === "production" ? "https" : "http"}://${
      ctx.req.headers.host
    }`;
  }

  const res = await fetch(`${uri}/api/entries`);

  if (res.ok) {
    return {
      entries: await res.json()
    };
  }

  return { entries: [] };
};

export default Home;
