// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCard from '../../components/Bounty/BountyCard';
import LargeOrganizationCard from '../../components/Organization/LargeOrganizationCard';
import Toggle from '../../components/Toggle/Toggle';
import About from '../../components/About/About';

const organization = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { organization } = router.query;
	const [isLoading, setIsLoading] = useState(true);
	const [issueTitleSearchTerm, setIssueTitleSearchTerm] = useState('');
	const [organizationData, setOrganizationData] = useState(null);
	const [bounties, setBounties] = useState([]);
	const [showAbout, setShowAbout] =useState(false);

	// Methods

	const filterByIssueTitle = (e) => {
		setIssueTitleSearchTerm(e.target.value);
	};

	async function populateOrganizationData() {
		setIsLoading(true);
		const org = await appState.openQSubgraphClient.getOrganization(
			organization
		);

		const orgData = await appState.githubRepository.fetchOrganizationByName(
			organization
		);

		const mergedOrgData = { ...org, ...orgData };

		setOrganizationData(mergedOrgData);
	}

	async function populateBountyData() {
		const bounties = organizationData.bountiesCreated;
		const bountyIds = bounties.map((bounty) => bounty.bountyId);
		const issueData = await appState.githubRepository.getIssueData(bountyIds);

		const fullBounties = [];
		bounties.forEach((bounty) => {
			const relatedIssue = issueData.find(
				(issue) => issue.id == bounty.bountyId
			);
			const mergedBounty = { ...bounty, ...relatedIssue };
			fullBounties.push(mergedBounty);
		});

		setBounties(fullBounties);
		setIsLoading(false);
	}

	// Hooks
	useEffect(() => {
		if (organizationData) {
			populateBountyData();
		}
	}, [organizationData]);

	useEffect(() => {
		if (organization) {
			populateOrganizationData();
		}
	}, [organization]);

	// Render
	if (isLoading) {
		return 'Loading...';
	} else {
		return (
			<div className="bg-dark-mode">
				{/* <h1 className="font-bold uppercase">{organizationData.name}</h1>
        <h1 className="font-bold uppercase">Bounties</h1> */}				
				<Toggle toggleFunc={setShowAbout} toggleVal={showAbout} names={['Bounties','About']}/>
				{(showAbout)?
					<About organizationData={organizationData}/>:
					<div className="grid grid-cols-wide justify-center w-f gap-8 pt-10">
					
						<LargeOrganizationCard organization={organizationData} />
					
						<div className="w-f space-y-3">
							<input
								className="outline-none w-full font-mont rounded-lg py-2 p-5 pb-1 border border-web-gray bg-dark-mode text-white"
								onKeyUp={(e) => filterByIssueTitle(e)}
								type="text"
								placeholder="Search Issue..."
							></input>
							<div className="text-gray-300 font-mont pt-1 font-normal">
								{bounties.length}
								{bounties.length < 2 ? ' Bounty found' : ' Bounties found'}
							</div>
							{bounties.length != 0
								? bounties
									.filter((bounty) => {
										return issueTitleSearchTerm
											? bounty.title
												.toLowerCase()
												.indexOf(issueTitleSearchTerm.toLowerCase()) > -1
											: bounty;
									})
									.map((bounty) => {
										return <BountyCard bounty={bounty} key={bounty.bountyId} />;
									})
								: 'No Bounties'}
						</div>
					</div>}
				{/* <h1 className='font-bold uppercase'>Total Contributions</h1>
				{organizationData.fundedTokenBalances.map(tokenBalance => {
					const tokenAddress = ethers.utils.getAddress(tokenBalance.tokenAddress);
					return (
						<div key={tokenBalance.id}>
							<div>Contract Address: {tokenAddress}</div>
							<div>Value: {ethers.utils.formatEther(ethers.BigNumber.from(tokenBalance.volume.toString()))}</div>
							<div>Name: {tokenMetadata[tokenAddress].name}</div>
							<div>Symbol: {tokenMetadata[tokenAddress].symbol}</div>
						</div>
					);
				})}
				<h1 className='font-bold uppercase'>Bounties Created</h1>
				{organizationData.bountiesCreated.length != 0 ? (
					organizationData.bountiesCreated.map(bounty => {
						return (
							<div key={bounty.bountyId}>
								<div>BountyId: {bounty.bountyId}</div>
							</div>
						);
					})
				) : 'No Bounties Created'}
				<h1 className='font-bold uppercase'>Bounty Contributions</h1>
				{organizationData.deposits.length != 0 ? (
					organizationData.deposits.map(deposit => {
						const tokenAddress = ethers.utils.getAddress(deposit.tokenAddress);
						return (
							<div key={deposit.id}>
								<div>Bounty Address: {deposit.bounty.id}</div>
								<div>Bounty Id: {deposit.bounty.bountyId}</div>
								<div>Contract Address: {tokenAddress}</div>
								<div>Value: {ethers.utils.formatEther(ethers.BigNumber.from(deposit.volume.toString()))}</div>
								<div>Name: {tokenMetadata[tokenAddress].name}</div>
								<div>Symbol: {tokenMetadata[tokenAddress].symbol}</div>
							</div>
						);
					})
				) : 'No Deposits on any Issues'} */}
			</div>
		);
	}
};

export default organization;
