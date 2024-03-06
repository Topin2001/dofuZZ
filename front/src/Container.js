import React from 'react';
import App from './App';

class Container extends React.Component {
    state = {isMounted: true};

    render() {
        const {isMounted = true, loadingPercentage = 0} = this.state;
        return (
            <>
                {isMounted && <App onProgress={loadingPercentage => this.setState({ loadingPercentage })} />}
            </>
        )
    }
}

export default Container;