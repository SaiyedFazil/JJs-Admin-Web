import { LoaderCircleIcon, LoaderIcon, LoaderPinwheelIcon, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export type SpinnerProps = LucideProps & {
  variant?:
    | "default"
    | "circle"
    | "pinwheel"
    | "circle-filled"
    | "ellipsis"
    | "ring"
    | "bars"
    | "infinite";
};

type SpinnerVariantProps = Omit<SpinnerProps, "variant">;

const Default = ({ className, ...props }: SpinnerVariantProps) => (
  <LoaderIcon className={cn("animate-spin", className)} {...props} />
);

const Circle = ({ className, ...props }: SpinnerVariantProps) => (
  <LoaderCircleIcon className={cn("animate-spin", className)} {...props} />
);

const Pinwheel = ({ className, ...props }: SpinnerVariantProps) => (
  <LoaderPinwheelIcon className={cn("animate-spin", className)} {...props} />
);

const CircleFilled = ({ className, size = 24, ...props }: SpinnerVariantProps) => (
  <svg
    height={size}
    width={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <title>Loading...</title>
    <style>{`
      @keyframes spinner-cf-rotate {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      .spinner-cf {
        transform-origin: 12px 12px;
        animation: spinner-cf-rotate 0.8s linear infinite;
      }
    `}</style>
    {/* Static background track ring at 20% opacity */}
    <circle cx="12" cy="12" r="9" opacity="0.2" />
    {/* Spinning foreground arc */}
    <path className="spinner-cf" d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const Ellipsis = ({ size = 24, className, ...props }: SpinnerVariantProps) => {
  return (
    <svg
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <title>Loading...</title>
      <style>{`
        .spinner-ellipsis-dot {
          animation: spinner-ellipsis-bounce 1.4s infinite ease-in-out both;
        }
        .spinner-ellipsis-delay-1 {
          animation-delay: -0.32s;
        }
        .spinner-ellipsis-delay-2 {
          animation-delay: -0.16s;
        }
        @keyframes spinner-ellipsis-bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
        }
      `}</style>
      <circle
        className="spinner-ellipsis-dot spinner-ellipsis-delay-1"
        cx="4"
        cy="12"
        fill="currentColor"
        r="2"
      />
      <circle
        className="spinner-ellipsis-dot spinner-ellipsis-delay-2"
        cx="12"
        cy="12"
        fill="currentColor"
        r="2"
      />
      <circle className="spinner-ellipsis-dot" cx="20" cy="12" fill="currentColor" r="2" />
    </svg>
  );
};

const Ring = ({ size = 24, className, ...props }: SpinnerVariantProps) => (
  <svg
    height={size}
    stroke="currentColor"
    viewBox="0 0 44 44"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <title>Loading...</title>
    <style>{`
      .spinner-ring-circle {
        animation: spinner-ring-anim 1.8s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        transform-origin: 22px 22px;
      }
      .spinner-ring-delay {
        animation-delay: -0.9s;
      }
      @keyframes spinner-ring-anim {
        0% {
          r: 1px;
          stroke-opacity: 1;
        }
        100% {
          r: 20px;
          stroke-opacity: 0;
        }
      }
    `}</style>
    <g fill="none" fillRule="evenodd" strokeWidth="2">
      <circle className="spinner-ring-circle" cx="22" cy="22" r="1" />
      <circle className="spinner-ring-circle spinner-ring-delay" cx="22" cy="22" r="1" />
    </g>
  </svg>
);

const Bars = ({ size = 24, className, ...props }: SpinnerVariantProps) => (
  <svg
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <title>Loading...</title>
    <style>{`
      .spinner-bar {
        animation: spinner-bars-animation .8s linear infinite;
        animation-delay: -.8s;
      }
      .spinner-bars-2 {
        animation-delay: -.65s;
      }
      .spinner-bars-3 {
        animation-delay: -0.5s;
      }
      @keyframes spinner-bars-animation {
        0% {
          y: 1px;
          height: 22px;
        }
        93.75% {
          y: 5px;
          height: 14px;
          opacity: 0.2;
        }
      }
    `}</style>
    <rect className="spinner-bar" fill="currentColor" height="22" width="6" x="1" y="1" />
    <rect
      className="spinner-bar spinner-bars-2"
      fill="currentColor"
      height="22"
      width="6"
      x="9"
      y="1"
    />
    <rect
      className="spinner-bar spinner-bars-3"
      fill="currentColor"
      height="22"
      width="6"
      x="17"
      y="1"
    />
  </svg>
);

const Infinite = ({ size = 24, className, ...props }: SpinnerVariantProps) => (
  <svg
    height={size}
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 100 100"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <title>Loading...</title>
    <style>{`
      .spinner-infinite-path {
        animation: spinner-infinite-anim 2s linear infinite;
      }
      @keyframes spinner-infinite-anim {
        0% {
          stroke-dashoffset: 0;
        }
        100% {
          stroke-dashoffset: 256.58892822265625;
        }
      }
    `}</style>
    <path
      className="spinner-infinite-path"
      d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
      fill="none"
      stroke="currentColor"
      strokeDasharray="205.271142578125 51.317785644531256"
      strokeLinecap="round"
      strokeWidth="10"
      style={{
        transform: "scale(0.8)",
        transformOrigin: "50px 50px",
      }}
    />
  </svg>
);

export const Spinner = ({ variant, ...props }: SpinnerProps) => {
  switch (variant) {
    case "circle":
      return <Circle {...props} />;
    case "pinwheel":
      return <Pinwheel {...props} />;
    case "circle-filled":
      return <CircleFilled {...props} />;
    case "ellipsis":
      return <Ellipsis {...props} />;
    case "ring":
      return <Ring {...props} />;
    case "bars":
      return <Bars {...props} />;
    case "infinite":
      return <Infinite {...props} />;
    default:
      return <Default {...props} />;
  }
};
