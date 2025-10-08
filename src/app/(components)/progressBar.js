'use client'; // Ensure this is a client component

import NextNProgress from 'nextjs-progressbar'; // Import the progress bar

const ProgressBar = () => {
  return (
    <NextNProgress
      color="#29D" // Customize the color of the progress bar
      startPosition={0.3} // Position where the progress bar starts
      stopDelayMs={200} // Delay before the progress bar stops
      height={5} // Height of the progress bar
      showOnShallow // Show the progress bar on shallow routing
    />
  );
};

export default ProgressBar;