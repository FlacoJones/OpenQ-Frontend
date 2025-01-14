// Third Party
import React, { useContext } from 'react';
import Image from 'next/image';
import StoreContext from '../../store/Store/StoreContext';
const ethers = require('ethers');

const TokenBalances = ({ tokenBalances, tokenValues, claimed }) => {
	const [appState] = useContext(StoreContext);

	const { tokenMetadata } = appState;

	return (
		<div className="flex flex-col pt-4 pb-6">
			<div className="font-semibold text-white">{claimed ? 'Total Value Claimed' : 'Total Value Locked (TVL)'}</div>
			<div className="font-bold text-xl text-white">
				{tokenValues
					? `${appState.utils.formatter.format(tokenValues.total)}`
					: `${appState.utils.formatter.format(0)}`}
			</div>
			<div className="flex flex-row space-x-2 pt-1">
				<div>
					{tokenValues
						? tokenBalances.map((tokenBalance) => {
							const tokenAddress = ethers.utils.getAddress(
								tokenBalance.tokenAddress
							);
							const tokenValueAddress = tokenMetadata[tokenAddress].address;

							const { volume } = tokenBalance;
							let symbol = tokenMetadata[tokenAddress].symbol;
							let usdValue = appState.utils.formatter.format(
								tokenValues.tokens[tokenValueAddress.toLowerCase()]
							);

							return (
								<div
									className="flex flex-row flex-wrap gap-2 text-white"
									key={symbol}
								>
									<div className="pt-1">
										<Image
											src={tokenMetadata[tokenAddress].logoURI}
											alt="n/a"
											width="16"
											height="16"
										/>
									</div>
									<div className="text-lg text-white">{usdValue}</div>{' '}
									<div className="text-lg text-white">
										(
										{ethers.utils.formatUnits(
											ethers.BigNumber.from(volume.toString()), parseInt(tokenMetadata[tokenAddress].decimals)
										)}{'\xa0'}
										{symbol.toUpperCase()})
									</div>
									
								</div>
							);
						})
						: null}
				</div>
			</div>
		</div>
	);
};

export default TokenBalances;
