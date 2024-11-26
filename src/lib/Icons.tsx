import { type LucideProps } from "lucide-react";

export const Icons = {
  google: (props: LucideProps) => (
    <svg {...props} aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
        fill="#EA4335"
      ></path>
      <path
        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
        fill="#4285F4"
      ></path>
      <path
        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
        fill="#FBBC05"
      ></path>
      <path
        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
        fill="#34A853"
      ></path>
    </svg>
  ),
  bike: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      data-src="https://cdn.hugeicons.com/icons/motorbike-02-stroke-standard.svg"
      role="img"
    >
      <path
        d="M20.2343 7.86957C21.5158 9.42897 21.961 10.9117 21.9989 11.6957C21.3288 11.3893 20.5765 11.2174 19.7816 11.2174C17.3364 11.2174 14.4995 13 14.4995 16H9.49947C9.49947 13 7 11 4 11L2 9.66597V8L10.0038 9.66597L10.9732 9.10614C12.2615 8.22518 14.3032 7.39305 16.3384 8.12822L17.5 8.5L20.2343 7.86957ZM20.2343 7.86957C19.431 6.89211 18.2992 5.88452 16.7331 5"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <circle
        cx="19.5"
        cy="16.5"
        r="2.5"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></circle>
      <circle
        cx="4.5"
        cy="16.5"
        r="2.5"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></circle>
    </svg>
  ),
  scooter: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      data-src="https://cdn.hugeicons.com/icons/scooter-02-stroke-standard.svg"
      role="img"
    >
      <path
        d="M2 16C2 12.8182 4.23858 11 7 11C9.76142 11 12 12.8182 12 16H2Z"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M5 8H9"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M10 16C10 17.6569 8.65685 19 7 19C5.34315 19 4 17.6569 4 16"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <circle
        cx="20"
        cy="17"
        r="2"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></circle>
      <path
        d="M16 8C17.3333 8.63768 20 11.1739 20 15M16 8L19 8C19 7.06812 19 6.60218 18.8478 6.23463C18.6448 5.74458 18.2554 5.35523 17.7654 5.15224C17.3978 5 16.9285 5 15.9899 5M16 8L15.9899 8M15.9899 8C15.9899 9.91304 15.7776 16 12 16H18M15.9899 8V5M15.9899 5H13.5"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  ),
};
