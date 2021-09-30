import BountyCard from "./BountyCard";
import { useEffect, useState, useContext } from "react";
import StoreContext from "../store/Store/StoreContext";
import { ethers } from 'ethers';

const BountyCardList = () => {
  const [appState, dispatch] = useContext(StoreContext);
  const [issueIds, setIssueIds] = useState([]);
  const [issueIdToAddress, setIssueIdToAddress] = useState({});
  const [issueData, setIssueData] = useState([]);
  const [fundingData, setFundingData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  async function getAllIssues() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(appState.openQAddress, appState.OpenQ.abi, provider);
      try {
        const allIssueIds = await contract.getIssueIds();
        return allIssueIds;
      } catch (err) {
        console.log("getAllIssues Error: ", err);
      }
    }
  }

  async function getIssueAddresses(issues) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(appState.openQAddress, appState.OpenQ.abi, provider);
      const issueIdToAddress = {};
      try {
        for (const issueId of issues) {
          const issueAddress = await contract.issueToAddress(issueId);
          issueIdToAddress[issueId] = issueAddress;
        }
        return issueIdToAddress;
      } catch (err) {
        console.log("getIssueAddresses Error: ", err);
      }
    }
  }

  async function getIssueData(issues) {
    const issueDataObjects = [];
    for (let issueId of issues) {
      const response = await appState.githubRepository.fetchIssueById(issueId);
      const responseData = response.data.node;
      const { title, body, url } = responseData;
      const repoName = responseData.repository.name;
      const avatarUrl = responseData.repository.owner.avatarUrl;
      const owner = responseData.repository.owner.login;
      const labels = responseData.labels.edges.map(edge => edge.node);

      const issueData = { issueId, title, body, url, repoName, owner, avatarUrl, labels };

      issueDataObjects.push(issueData);
    }
    return issueDataObjects;
  }

  async function getIssueDeposits(issueIdToAddresses) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let issueDeposits = {};
      try {
        for (const [issueId, issueAddress] of Object.entries(issueIdToAddresses)) {
          issueDeposits[issueId] = [];
          for (const tokenAddress of appState.tokenAddresses) {
            const contract = new ethers.Contract(tokenAddress, appState.ERC20.abi, provider);
            const symbol = await contract.symbol();
            const name = await contract.name();
            const issueBalanceBigNumber = await contract.balanceOf(issueAddress);

            var balance = parseFloat(issueBalanceBigNumber.toString()).toFixed(2);

            const deposit = { symbol, name, balance, issueAddress };
            if (balance > 0) {
              issueDeposits[issueId].push(deposit);
            }
          }
        }
        return issueDeposits;
      } catch (err) {
        console.log("getIssueDeposits Error: ", err);
      }
    }
  }

  useEffect(() => {
    async function populateBountyData() {
      const issues = await getAllIssues();
      setIssueIds(issues);

      const issueIdToAddresses = await getIssueAddresses(issues);
      setIssueIdToAddress(issueIdToAddresses);

      const issueData = await getIssueData(issues);
      setIssueData(issueData);

      const fundingDataObject = await getIssueDeposits(issueIdToAddresses);
      setFundingData(fundingDataObject);

      setIsLoading(false);
    }

    populateBountyData();
  }, []);

  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  } else {
    console.log("fundingData", fundingData);
    return (
      <div className="grid grid-cols-3 gap-6 pr-20">
        {issueData.map((issue) => {
          return <BountyCard
            repoName={issue.repoName}
            issueName={issue.title}
            avatarUrl={issue.avatarUrl}
            labels={issue.labels}
            address={issueIdToAddress[issue.issueId]}
            deposits={fundingData[issue.issueId]}
            key={issue.issueId} />;
        })}
      </div>
    );
  }
};

export default BountyCardList;
