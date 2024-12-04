import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import loadingAnimation from '~/assets/lottie/loading.json';

export default function Loading() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Lottie
      animationData={loadingAnimation}
      loop={true}
      style={{
        height: 100,
      }}
    />
  );
}
