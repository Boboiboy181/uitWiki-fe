export default function Loading() {
  return (
    <svg width="30" height="30" stroke="#000" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
        .spinner {
          transform-origin: center;
          animation: spinner-rotate 2s linear infinite;
        }
        .spinner circle {
          stroke-linecap: round;
          animation: spinner-dash 1.5s ease-in-out infinite;
        }
        @keyframes spinner-rotate {
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spinner-dash {
          0% {
            stroke-dasharray: 0 150;
            stroke-dashoffset: 0;
          }
          47.5% {
            stroke-dasharray: 42 150;
            stroke-dashoffset: -16;
          }
          95%, 100% {
            stroke-dasharray: 42 150;
            stroke-dashoffset: -59;
          }
        }
      `}
      </style>
      <g className="spinner">
        <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
      </g>
    </svg>
  );
}
