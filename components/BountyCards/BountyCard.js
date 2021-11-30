// Third Party
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
// Custom
import BountyCardDetailsModal from "./BountyCardDetailsModal";
import StoreContext from "../../store/Store/StoreContext";
import router from "next/router";

const BountyCard = (props) => {
	const {
		bounty
	} = props;

	const [showModal, setShowModal] = useState(false);
	const [tvl, setTvl] = useState(0);
	const bountyName = title.toLowerCase();
	const [appState] = useContext(StoreContext);

	const getDate = () => {
		const rawDate = createdAt;
		const date = new Date(rawDate);
		return date.toDateString().split(" ").slice(1).join(" ");
	};

	// fetch deposits
	useEffect(async () => {
		let cleanedDeposits = {};
		deposits.map((d) => {
			let coin;
			if (d.name == "Fake") {
				coin = "ethereum";
			} else if (d.name == "Mock") {
				coin = "bitcoin";
			} else {
				coin = d.name;
			}
			cleanedDeposits[coin] = d.balance;
		});

		const data = cleanedDeposits;
		const url = appState.coinApiBaseUrl + "/tvl";

		//only query tvl for bounties that have deposits
		if (JSON.stringify(data) != "{}") {
			await axios
				.post(url, data)
				.then((result) => {
					setTvl(result.data.total);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	});

	return (
		<div>
			<Link href={`/?address=${address}`} as={`/bounty/${address}`}>
				<div
					className={
						"flex flex-col p-6 font-mont rounded-xl shadow-sm bg-white cursor-pointer pr-10 pl-10"
					}
					onClick={() => setShowModal(true)}
				>
					<div className="flex flex-row justify-between">
						<div>
							<div className="flex flex-grow flex-row items-center space-x-2">
								{/*  <div>{isClaimed ? "Claimed" : "Unclaimed"}</div> */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill={closed ? "#F0431D" : "#15FB31"}
									viewBox="0 0 16 16"
									width="19"
									height="19"
								>
									<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
									<path
										fillRule="evenodd"
										d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
									></path>
								</svg>
								<div className="font-mont text-2xl">
									{owner.toLowerCase()}/{repoName.toLowerCase()}
								</div>
							</div>
							<div className="font-bold text-xl pl-6">
								{title.length < 50
									? title.toLowerCase()
									: bountyName.slice(0, 50) + "..."}
							</div>
							<div className="flex flex-row items-center space-x-4 pt-1">
								<div className="font-mont font-light pl-6 text-sm text-gray-500">
									Opened {getDate()}
								</div>
							</div>
						</div>
						<div className="flex flex-col">
							<Image src={avatarUrl} alt="avatarUrl" width="51" height="51" />
						</div>
					</div>
					<div className="flex flex-row pt-3 pl-6 pr-3  items-center justify-between">
						<div>
							{labels ? (
								<div className="flex flex-row justify-between">
									<div className="space-x-2">
										{labels.map((label, index) => {
											if (index < 2) {
												return (
													<button
														key={index}
														className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-purple-500 text-white"
													>
														{label.name}
													</button>
												);
											} else if (index == 2) {
												return (
													<button
														key={index}
														className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-green-300 text-white"
													>
														more..
													</button>
												);
											} else {
												null;
											}
										})}
									</div>
								</div>
							) : null}
						</div>
						<div className="flex flex-row space-x-1 items-center">
							<div className="pr-2 pt-1">
								<Image
									src="/BountyMaterial/eth.png"
									alt="avatarUrl"
									width="12"
									height="20"
								/>
							</div>
							<div className="font-semibold">TVL</div>
							<div>$ {parseFloat(tvl).toFixed(2)}</div>
						</div>
					</div>
				</div>
			</Link>
			{showModal && <BountyCardDetailsModal
				bounty={bounty}
				modalVisibility={setShowModal} />}
			totalDeposits={parseFloat(tvl).toFixed(2)}
		</div>
	);
};

export default BountyCard;
