import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

// Provider, Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
	const [githubUser, setGithubUser] = useState(mockUser);
	const [repos, setRepos] = useState(mockRepos);
	const [followers, setFollowers] = useState(mockFollowers);
	// request loading
	const [requests, setRequest] = useState(0);
	const [loading, setIsLoading] = useState(false);
	// error
	const [error, setError] = useState({ show: false, msg: '' });
	// check rate
	const checkRequests = () => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let { rate: { remaining } } = data;
				setRequest(remaining);
				if (remaining === 0) {
					toggleError(true, 'sorry, sorry you have exeeded your hourly rate limit!');
				}
			})
			.catch((error) => console.log(error));
	};
	function toggleError(show = false, msg = '') {
		setError({ show, msg });
	}
	// error
	useEffect(checkRequests, []);

	return (
		<GithubContext.Provider value={{ githubUser, repos, followers, requests, error }}>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubProvider, GithubContext };
