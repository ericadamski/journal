import { AnimatePresence } from "framer-motion";

export default ({ Component, pageProps }) => (
  <>
    <AnimatePresence exitBeforeEnter>
      <Component {...pageProps} />
    </AnimatePresence>
    <style global jsx>{`
      :root {
        --pink: #ffd5e5; //#e7008a;
        --green: #a0ffe6;
        --yellow: #ffffdd;
        --blue: #81f5ff;
        --foreground: #262626;
        --background: #ffffff;
        --border-radius: 0.5rem;
      }

      @font-face {
        font-family: "Paytone One";
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local("Paytone One Regular"), local("PaytoneOne-Regular"),
          url(https://fonts.gstatic.com/s/paytoneone/v12/0nksC9P7MfYHj2oFtYm2ChTtgPvfiwq-.woff2)
            format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: "Roboto";
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local("Roboto"), local("Roboto-Regular"),
          url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2)
            format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: "Roboto";
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: local("Roboto Bold"), local("Roboto-Bold"),
          url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2)
            format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }

      html,
      body,
      * {
        box-sizing: border-box;
        font-family: "Roboto", sans-serif;
      }

      body {
        margin: 0;
        background: var(--background);
        color: var(--foreground);
        padding: 2rem 3rem;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 0;
        padding: 0;
        font-family: "Paytone One", sans-serif;
      }
      p {
        margin: 0;
        padding: 0;
      }
    `}</style>
  </>
);
