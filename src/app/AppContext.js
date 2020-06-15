import React from 'react';
export const APPContext = React.createContext(null);

if (process.env.NODE_ENV !== 'production') {
    APPContext.displayName = 'AppContext';
}

export default APPContext;