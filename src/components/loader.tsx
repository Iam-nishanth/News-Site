import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader = () => {
    return <DotLottieReact style={{ width: '500px', height: '500px' }} src="/animations/plane.json" loop autoplay />;
};

export default Loader;
