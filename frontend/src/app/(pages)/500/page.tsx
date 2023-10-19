// This page is used to redirect the user to the default error page (app/error.tsx) from the middleware, in the case of auth fetch failures.
// This is because any errors in the middleware are not automatically caught by the error boundary in the app.
// This should NOT be called directly from the frontend.

export default function ErrorCallback() {
  throw new Error("Internal Server Error");
}
