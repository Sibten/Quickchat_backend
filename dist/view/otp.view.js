"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpTemplate = void 0;
const otpTemplate = (OTP) => {
    return `<!DOCTYPE html>
	<html lang="en">
	  <head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>OTP</title>
		<style>
		  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@300;500&family=Poppins:wght@300;400&family=Quicksand:wght@400;500&family=Varela+Round&display=swap");
		  * {
			margin: 2px;
			font-family: "Poppins", sans-serif;
		  }
		  h2 {
			background-color: rgb(14, 14, 85);
			color: white;
			padding: 8px;
		  }
		  h3 {
			padding: 8px;
			background-color: rgb(228, 228, 228);
			width: max-content;
			letter-spacing: 5px;
			margin-right: auto;
			margin-left: auto;
		  }
		  .img {
			width: max-content;
			margin-left: auto;
			margin-right: auto;
		  }
		  p {
			padding: 20px;
		  }
		  @media screen and (min-width: 480px) {
			body {
			  width: 50%;
			  margin-left: auto;
			  margin-right: auto;
			}
		  }
		</style>
	  </head>
	  <body>
		<h2>Quick Chat</h2>
		<div class="img">
		  <img
			src="https://cdn-icons-png.flaticon.com/128/1041/1041916.png"
			alt="chat"
		  />
		</div>
	
		<p>
		  Hello User! Welcome to new world. Thanks for choosing Quick Chat. Here is
		  your one time password for login
		</p>
		<h3>${OTP}</h3>
	  </body>
	</html>
	`;
};
exports.otpTemplate = otpTemplate;
