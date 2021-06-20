import { createContext, useContext, useState } from 'react';

const AppContext = createContext( {
	cartIsOpen: false,
	setCartIsOpen: () => undefined,
} );
export const useApp = () => useContext( AppContext );

export const AppProvider = ( { children } ) => {
	const [ cartIsOpen, setCartIsOpen ] = useState( false );

	const app = {
		cartIsOpen,
		setCartIsOpen,
	};
	return (
		<AppContext.Provider value={ app }>{ children }</AppContext.Provider>
	);
};
