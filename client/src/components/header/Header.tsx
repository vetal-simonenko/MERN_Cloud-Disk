import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';

import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { logoutUser } from '../../reducers/userReducer';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import SearchForm from '../searchForm/searchForm';

const pages = [
	{ label: 'Login', url: '/login' },
	{ label: 'Registration', url: '/registration' },
];

const ActiveLink = styled(NavLink)({
	'&.active': {
		color: '#edff00',
	},
});

const ResponsiveAppBar = () => {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null
	);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const isAuth = useAppSelector((state) => state.user.isAuth);
	const currentUser = useAppSelector(
		(state) => state.user.currentUser as { avatar: string }
	);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const avatar = currentUser.avatar
		? `${import.meta.env.VITE_API_URL}/${currentUser.avatar}`
		: '';

	// TODO: need to delete later
	const user = useAppSelector((state) => state.user);
	const files = useAppSelector((state) => state.files);
	const upload = useAppSelector((state) => state.upload);
	console.log(user);
	console.log(files);
	console.log(upload);

	return (
		<AppBar position='static'>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<AdbIcon
						sx={{
							display: { xs: 'none', md: 'flex' },
							mr: 1,
						}}
					/>
					<Typography
						variant='h6'
						noWrap
						component={Link}
						to='/'
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						MERN CLOUD
					</Typography>
					{isAuth && <SearchForm />}
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: 'flex', md: 'none' },
						}}
					>
						<IconButton
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
							color='inherit'
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id='menu-appbar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem
									key={page.label}
									onClick={handleCloseNavMenu}
								>
									<Typography textAlign='center'>
										{page.label}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<AdbIcon
						sx={{
							display: { xs: 'flex', md: 'none' },
							mr: 1,
						}}
					/>
					<Typography
						variant='h6'
						noWrap
						component={Link}
						to='/'
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
							lineHeight: 1,
						}}
					>
						MERN
						<br /> CLOUD
					</Typography>
					{!isAuth ? (
						<Box
							component='nav'
							sx={{
								flexGrow: 1,
								display: { xs: 'none', md: 'flex' },
								justifyContent: 'flex-end',
								marginInlineEnd: '20px',
							}}
						>
							{pages.map((page) => (
								<Button
									to={page.url}
									key={page.label}
									component={ActiveLink}
									onClick={handleCloseNavMenu}
									sx={{
										my: 2,
										color: 'white',
										display: 'block',
									}}
								>
									{page.label}
								</Button>
							))}
						</Box>
					) : (
						<Box sx={{ flexGrow: 0, marginLeft: 'auto' }}>
							<Tooltip title='Open settings'>
								<IconButton
									onClick={handleOpenUserMenu}
									sx={{ p: 0 }}
								>
									<Avatar alt='User' src={avatar} />
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id='menu-appbar'
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem
									onClick={() => {
										navigate('/profile');
									}}
								>
									<Typography textAlign='center'>
										Profile
									</Typography>
								</MenuItem>
								<MenuItem
									onClick={() => {
										dispatch(logoutUser());
										navigate('/login');
									}}
								>
									<Typography textAlign='center'>
										LogOut
									</Typography>
								</MenuItem>
							</Menu>
						</Box>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default ResponsiveAppBar;
