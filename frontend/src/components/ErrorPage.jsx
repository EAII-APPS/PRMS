import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  return (
    <div
      id="error-page"
      className="flex flex-col gap-5 justify-center items-center h-screen"
    >
      <h1 className="text-6xl font-bold font-sans text-red-900">Oops!</h1>
      <p className="text-3xl font-sans">
        <i>
          {error.statusText === "Not Found"
            ? "404 | Not Found"
            : error.statusText || error.message}
        </i>
      </p>
    </div>
  );
}
export default ErrorPage;
