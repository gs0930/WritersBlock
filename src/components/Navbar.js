import React from 'react';
import {
Nav,
NavLink,
Bars,
NavMenu,

} from './NavbarElements';

const Navbar = () => {
return (
	<>
	<Nav>

		<NavMenu>
		<NavLink to='/new'>
			CreatePost
		</NavLink>
		<NavLink to='/'>
			Posts
		</NavLink>
        <NavLink to='/analyzer'>
			Text Analyzer
		</NavLink>
		<NavLink to='/write'>
			Write
		</NavLink>
		
		</NavMenu>
		
	</Nav>
	</>
);
};

export default Navbar;
