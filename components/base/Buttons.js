import Link from "next/link";

export const PrimaryButton = ({ sr, onClick, href, children }) => {
  if( href ) {
    return (
      <Link
        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-black bg-white border border-transparent rounded shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        href={ href }
      >
        <span className="sr-only">{sr}</span>
        {children}
      </Link>
    );
  } else {
    return (
      <button
        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-black bg-white border border-transparent rounded shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        onClick={ onClick }
      >
        <span className="sr-only">{sr}</span>
        {children}
      </button>
    );
  }
};