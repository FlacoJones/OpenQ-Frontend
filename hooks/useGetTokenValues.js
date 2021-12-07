import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import StoreContext from '../store/Store/StoreContext';

const useGetTokenValues = (bounty) => {
	const [tokenValues, setTokenValues] = useState(null);
	const [appState] = useContext(StoreContext);

	useEffect(async () => {
		if (bounty != null) {
			let tokenVolumes = {};

			bounty.bountyTokenBalances.map((tokenBalance) => {
				if (tokenBalance.tokenAddress == '0x6075040cda6e5c12483295d7287c8c44abb0f975') {
					tokenVolumes['0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39'] = tokenBalance.volume;
				} else {
					tokenVolumes['0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'] = tokenBalance.volume;
				}
			});

			const data = { tokenVolumes };
			const url = appState.coinApiBaseUrl + '/tvl';

			//only query tvl for bounties that have deposits
			if (JSON.stringify(data.tokenVolumes) != '{}') {
				await axios
					.post(url, data)
					.then((result) => {
						// FOR NOW JUST REASSIGN THE PRICES from other coin to FAKE and MOCK
						console.log(data.tokenVolumes);
						console.log(result.data);
						let foo = { ...result.data };
						foo['tokens']['0x5fbdb2315678afecb367f032d93f642f64180aa3'] = result.data.tokens['0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'];
						foo['tokens']['0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'] = result.data.tokens['0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39'];
						setTokenValues(foo);
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				setTokenValues({});
			}
		}
	}, [bounty]);

	return [tokenValues, setTokenValues];
};

export default useGetTokenValues;