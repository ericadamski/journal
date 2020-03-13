import { useState, useRef, useEffect } from "react";
import useSWR, { mutate } from "swr";
import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ReactMarkdown from "react-markdown";
import ListIsEmpty from "../vectors/ListIsEmpty";
import Bye from "../vectors/Bye";
import Cancel from "../vectors/Cancel";
import Journal from "../services/journal";

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
  const router = useRouter();

  const current =
    router.query.id && entries.find(entry => entry.id === router.query.id);

  useEffect(() => {
    document.getElementById(current?.id)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });
  }, [current]);

  const login = async event => {
    event.preventDefault();

    const { pwd } = event.target.elements;

    setAuthed(await auth(pwd.value));
  };

  const add = async () => {
    if (!authed) return;

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
      {
        id: "temp",
        fields: { date: Date.now(), rating, entry: entry.current.value }
      }
    ]);

    entry.current && (entry.current.value = "");
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>
          📖 Eric's Journal{" "}
          {current &&
            `| ${new Date(current?.fields?.date).toLocaleString("en-CA", {
              month: "short",
              day: "numeric"
            })}`}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#ffd5e5" />
        <meta name="twitter:site" content="@zealigan" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="og:title"
          content={`📖 Eric's Journal ${
            current
              ? `| ${new Date(current?.fields?.date).toLocaleString("en-CA", {
                  month: "short",
                  day: "numeric"
                })}`
              : ""
          }`}
        />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta name="og:url" content="https://journal.ericadamski.dev" />
        <meta
          name="description"
          content={
            current
              ? current.fields.entry
              : "My personal journal, daily entries about what is going on in my life. It's written for me, not you. You're welcome to read it."
          }
        />
        <meta
          name="og:description"
          content={
            current
              ? current.fields.entry
              : "My personal journal, daily entries about what is going on in my life. It's written for me, not you. You're welcome to read it."
          }
        />
        <meta
          name="og:image"
          content="https://journal.ericadamski.dev/favicon.png"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-129208280-7"
        />
        <script>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-129208280-7');
       `}</script>
      </Head>
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
        {entries?.length < 1 ? (
          <div className="entries__empty">
            <h2>No entries here yet 🤕</h2>
            <ListIsEmpty style={{ maxHeight: "500px" }} />
          </div>
        ) : (
          <>
            {entries?.map(entry => {
              return (
                <div>
                  <motion.div
                    id={entry.id}
                    exit="closed"
                    positionTransition
                    style={
                      current && current.id !== entry.id && { opacity: 0.3 }
                    }
                    animate={entry.id === current?.id ? "open" : "closed"}
                    variants={{
                      open: {
                        scale: 1.05,
                        z: 0
                      },
                      closed: {
                        scale: 1
                      }
                    }}
                    transformTemplate={({ scale }) => `scale(${scale})`}
                    className="entry"
                    key={entry.id}
                    onClick={() =>
                      entry.id !== current?.id &&
                      router.push(`/?id=${entry.id}`)
                    }
                  >
                    {entry.id === current?.id && (
                      <div
                        className="icon"
                        onClick={event => {
                          event.stopPropagation();
                          router.push("/");
                        }}
                      >
                        <Cancel style={{ width: "2rem", height: "2rem" }} />
                      </div>
                    )}
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
                  </motion.div>
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
      <style global jsx>{`
        img {
          max-width: 500px;
          padding: 1rem;
        }
      `}</style>
      <style jsx>{`
        .entries {
          position: relative;
          padding: 2rem 0;
        }

        div > :global(.entry) > .icon {
          position: absolute;
          right: 1rem;
        }

        div > :global(.entry) {
          position: relative;
          background: var(--background);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          margin: 1rem 0;
          border-radius: var(--border-radius);
          box-shadow: 0 0px 2.2px rgba(0, 0, 0, 0.02),
            0 0px 5.3px rgba(0, 0, 0, 0.028), 0 0px 10px rgba(0, 0, 0, 0.035),
            0 0px 17.9px rgba(0, 0, 0, 0.042), 0 0px 33.4px rgba(0, 0, 0, 0.05),
            0 0px 80px rgba(0, 0, 0, 0.07);
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

export async function getServerSideProps(context) {
  return {
    props: {
      entries: await Journal.list()
    }
  };
}

export default Home;
