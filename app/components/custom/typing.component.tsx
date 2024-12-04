import Lottie from 'lottie-react';
import typingAnimation from '~/assets/lottie/typing.json';

export default function Typing() {
  return (
    <Lottie
      animationData={typingAnimation}
      loop={true}
      style={{
        height: 50,
      }}
      className="animate-pulse"
    />
  );
}
