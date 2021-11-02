import Image from 'next/image';
import { useState } from 'react';

const DisplayPrice = (props) => {
	// return (
	/*   <svg
=======
	return (
		/*   <svg
>>>>>>> main
							width="22"
							height="22"
							viewBox="0 0 32 32"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm-.171 8H9.277v5.194H7v1.861h2.277v1.953H7v1.86h2.277V24h6.552c3.94 0 6.938-2.095 8.091-5.131H26v-1.86h-1.624c.04-.33.06-.668.06-1.01v-.046c0-.304-.016-.604-.047-.898H26v-1.86h-2.041C22.835 10.114 19.814 8 15.829 8zm6.084 10.869c-1.007 2.075-3.171 3.462-6.084 3.462h-4.72v-3.462zm.564-3.814c.042.307.064.622.064.944v.045c0 .329-.023.65-.067.964H11.108v-1.953h11.37zM15.83 9.666c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z" />
						</svg> 
						 {deposits.map((deposit, index) => {
							return <div key={index} className="text-bold">{deposit.balance} : {deposit.symbol}</div>
						})}  */
	<div className="flex">
		<Image
			src="/cryptocurrency-icons/32/color/matic.png"
			alt="BTC"
			height={23}
			width={23}
		/>
	</div>
	);
};

export default DisplayPrice;
