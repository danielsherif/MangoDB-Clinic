import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Typography, Card, CardContent, Button,Grid } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Spinner from "./GeneralComponents/Spinner";
import { checkout2, patientPayPrescription,checkout1 } from "../services/api";

import { SvgIcon } from '@mui/material';

import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
//   import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// import WalletIcon from "../";
const defaultTheme = createTheme();

export default function PrescriptionDetails() {
	let totalPrice = 0;
	const navigate = useNavigate();
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const { id } = useParams();

	const [open, setOpen] = React.useState(false);
	const [alertMessage, setAlertMessage] = React.useState('');
	
//  const WalletIcon = `${process.env.PUBLIC_URL}/icons/wallet.svg`;

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	const getPrice=async(medicationName) =>{
		const response = await axios.get(`localhost:8000/patient/getPrice/${medicationName}`);
		const price = await response.json();
		return price;
	}
	
	const calculateTotalPrice =async (medications)  =>{
		for (let medication of medications) {
			totalPrice += await getPrice(medication.medicationName);
		}
		return totalPrice;
	}
	const getData = async (id) => {
		try {
			setLoading(true);
			const response = await axios.get(
				`http://localhost:4000/patient/viewSelectedPrescription/${id}`
			);

			if (response.status === 200) {
				console.log("Response Status: " + response.status);
				console.log("Response Data: " + JSON.stringify(response.data));
				return response.data;
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	React.useEffect(() => {
		fetchData();
	}, []);

	
	  
	const fetchData = async () => {
		setLoading(true);
		try {
			const data = await getData(id);
			setData(data);
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	
	const handleWallet = async() => {
		try {
			// let totalPrice=50;

			

			// Call your backend API endpoint for wallet payment
			const response = await axios.post(
				`http://localhost:4000/patient/payPescriptionWallet/${totalPrice}`,
				null,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your actual token
					},
				}
			);


			// Check if the request was successful (status code 2xx)
			if (response.status === 200) {
				const { success, message } = response.data;
				console.log("Wallet Payment:", response.data);

				if (success) {
				// Handle success as needed
				setAlertMessage(message);
				setOpen(true);
			} else {
				setAlertMessage("Insufficient funds in the wallet");
				setOpen(true);
			}
			} else {
				console.error(
					"Failed to process wallet payment. Status:",
					response.status
				);
				// Log the full response for debugging purposes
				console.error("Full response:", response);

				// Handle error as needed
			}
		} catch (error) {
			// Log the details of the AxiosError
			console.error("Error during wallet payment:", error);
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.error("Server responded with status:", error.response.status);
				console.error("Response data:", error.response.data);
			} else if (error.request) {
				// The request was made but no response was received
				console.error("No response received");
			} else {
				// Something happened in setting up the request that triggered an Error
				console.error("Error message:", error.message);
			}
			// Handle error as needed
		}
	};

const handleCredit = async (e) => {
	try {
		
		console.log(e.currentTarget);
		const items = [{ id: 1, quantity: 1 }];

		const response = await checkout2(id, items);

		// Check if the request was successful (status code 2xx)
		if (response.status === 200) {
			const { url } = response.data;
			console.log("Checkout Session:", response.data);
			// Handle the session object as needed (e.g., redirect to the checkout page)
			window.location = url;
		} else {
			console.error("Failed to create checkout session");
			// Handle error as needed
		}
	} catch (error) {
		console.error("Error during checkout:", error);
		// Handle error as needed
	}
};

	

	return (
		
		<>
			{loading ? (
				<Spinner />
			) : (
				<>
					{console.log("Data: " + JSON.stringify(data))}
					{data ? (
						<>
							<Card>
								<CardContent>
									<Typography variant='h6'>Prescription Details</Typography>

									<Typography variant='body1'>
										Doctor:{" "}
										{`${data.doctorId.firstName} ${data.doctorId.lastName}`}
									</Typography>

									<Typography variant='body1'>
										Medications:
										{data.medications ? (
											data.medications.map((medication) => (
												<div key={medication.medicationName}>
													<ul>
														<li>{medication.medicationName}</li>
														<ul>
															<li>{medication.frequency}</li>
														</ul>
													</ul>
												</div>
											))
										) : (
											<div>No medications available</div>
										)}
									</Typography>

									<Typography variant='body1'>
										Date Issued: {new Date(data.date).toLocaleDateString()}
									</Typography>

									<Typography variant='body1'>
										Filled: {data.filled ? "Yes" : "No"}
									</Typography>

									<h3 variant='body1'
									>
										Pay using:

										
									</h3>
									{/* <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group"> */}

									{data.medications ? (
											 calculateTotalPrice(data.medications)
											 .then(total => {
												 console.log("Total Price: ", total);}
										) ): (
											<div>No medications available</div>
										)}

									<Grid container spacing={3}
									>
									<Grid style={{marginLeft:"100px"}}>
										<Button
											variant="outlined"
											component="label"
											endIcon={<WalletIcon />}
											onClick={handleWallet}
										>
											Wallet


											
										</Button>
									</Grid>
									
									<Grid style={{marginLeft:"20px"}}>
									<Button
										variant="outlined"
										color="secondary"
										component="label"
										endIcon={
											<SvgIcon >
												<CreditCardIcon />
											</SvgIcon>
										}
										onClick={handleCredit}
									>
										Credit card
									</Button>
									</Grid>
								</Grid>
									
								{/* </ButtonGroup> */}

								<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
									<MuiAlert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
										{alertMessage}
									</MuiAlert>
								</Snackbar>
								</CardContent>
							</Card>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									marginTop: "30px",
								}}
							>
								<Button variant='outlined' onClick={handleGoBack}>
									Go Back
								</Button>
							</div>
						</>
					) : (
						<div>No data available</div>
					)}
				</>
			)}
		</>
	);
}
