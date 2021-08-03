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
	const [isLoading, setIsLoading] = useState(false);
	// error
	const [error, setError] = useState({ show: false, msg: '' });

	const searchGithubUser = async (user) => {
		toggleError();
		setIsLoading(true);
		// setLoading(true)
		const response = await axios(`${rootUrl}/users/${user}`).catch((error) => console.log(error));

		if (response) {
			setGithubUser(response.data);
			// more logic here
		}
		else {
			toggleError(true, 'there is no user with that username');
		}
		checkRequests();
		setIsLoading(false);
	};
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
		<GithubContext.Provider value={{ githubUser, repos, followers, requests, error, searchGithubUser, isLoading }}>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubProvider, GithubContext };
