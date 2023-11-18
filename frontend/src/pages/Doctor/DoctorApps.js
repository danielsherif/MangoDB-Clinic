import { useEffect, useState } from "react";

import { Grid, Paper, Typography, TextField } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import {
	getMyAppointments,
	upcomingApp,
	filterAppointments,
	scheduleFollowup,
	statusEnum,
} from "../../services/api";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(2),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));

const DoctorApps = () => {
	const [appointments, setAppointments] = useState([]);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState("");
	const [status, setStatus] = useState("All");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [upcoming, setUpcoming] = useState(false);

	const [statEnum, setStatEnum] = useState(["All"]);

	// const getID = async () => {
	// 	try {
	// 		const response = await axios.post(
	// 			"http://localhost:4000/doctor/myInfo",
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${localStorage.getItem("token")}`,
	// 				},
	// 			}
	// 		);

	// 		if (response.status === 200) {
	// 			return response.data._id;
	// 		}
	// 	} catch (error) {}
	// };
	// const id = await getID();
	const [followUpDate, setFollowUpDate] = useState("");

	const handleFollowUpDateChange = (e) => {
		setFollowUpDate(e.target.value);
	};

	// function convertToISOFormat(dateString) {
	//     // Split the input string into day, month, and year
	//     const [day, month, year] = dateString.split('/');

	//     // Create a new Date object using the components
	//     const dateObject = new Date(`${year}-${month}-${day}`);

	//     // Use the toISOString method to get the date in ISO format
	//     const isoDateString = dateObject.toISOString().split('T')[0];

	//     return isoDateString;
	// }

	function convertToISOFormat(dateString) {
		try {
			// Split the input string into day, month, and year
			const [day, month, year] = dateString.split("/");

			// Create a new Date object in UTC using the components
			const dateObjectUTC = new Date(Date.UTC(year, month - 1, day));

			// Use the toISOString method to get the date in ISO format
			const isoDateString = dateObjectUTC.toISOString().split("T")[0];

			return isoDateString;
		} catch (error) {
			console.error("Error converting date to ISO format:", error);
			return null;
		}
	}
	const scheduleFollowupHandler = async (
		docotrId,
		patientId,
		appointmentId
	) => {
		try {
			if (!followUpDate) {
				alert("Please select a follow-up date.");
				return;
			}

			const response = await scheduleFollowup(
				docotrId,
				patientId,
				appointmentId,
				followUpDate
			);

			// Check if the response indicates success (adjust this based on your API response structure)
			if (response && response.status === 200) {
				// Reload the page on success
				window.location.reload();
			} else {
				console.error(
					"Error scheduling follow-up. Unexpected response:",
					response
				);
			}
		} catch (error) {
			// Log more details about the Axios error
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.error("Axios error - response data:", error.response.data);
				console.error("Axios error - response status:", error.response.status);
				console.error(
					"Axios error - response headers:",
					error.response.headers
				);
			} else if (error.request) {
				// The request was made but no response was received
				console.error("Axios error - no response received:", error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.error("Axios error - request setup:", error.message);
			}
		}
	};

	const handleUpcomingClick = () => {
		setUpcoming(!upcoming);
		setStatus("All");
		setFrom("");
		setTo("");
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		switch (name) {
			case "status":
				setStatus(value);
				break;
			case "from":
				value == "" ? setFrom("") : setFrom(value);
				break;
			case "to":
				value == "" ? setTo("") : setTo(value);
				break;
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		setIsPending(true);
		setAppointments([]);

		const query = { status, date_1: from, date_2: to };

		if (!query["status"]) {
			query["status"] = "All";
		}

		if (!query["date_1"]) {
			query["date_1"] = convertToISOFormat("01/01/1960");
		}

		if (!query["date_2"]) {
			query["date_2"] = convertToISOFormat("31/12/2060");
		}

		console.log(query);
		filterAppointments(query)
			.then((result) => {
				setAppointments(result.data);
				setIsPending(false);
			})
			.catch((err) => {
				setError(err.message);
				setIsPending(false);
			});
	};

	useEffect(() => {
		setIsPending(true);
		statusEnum()
			.then((result) => {
				setStatEnum(result.data);
				console.log(result.data);
				setIsPending(false);
			})
			.catch((err) => {
				setError(err.message);
				setIsPending(false);
			});
	}, []);

	useEffect(() => {
		if (!upcoming) {
			setAppointments([]);
			setIsPending(true);
			getMyAppointments()
				.then((result) => {
					setAppointments(result.data);
					setIsPending(false);
				})
				.catch((err) => {
					setError(err.message);
					setIsPending(false);
				});
		}
	}, [upcoming]);

	useEffect(() => {
		if (upcoming) {
			setIsPending(true);
			setAppointments([]);
			upcomingApp()
				.then((result) => {
					setIsPending(false);
					setAppointments(result.data);
				})
				.catch((err) => {
					setIsPending(false);
					setError(err.message);
				});
		}
	}, [upcoming]);

	useEffect(() => {
		console.log(appointments);
	}, [appointments]);

	return (
		<div>
			<h1>Appointments</h1>
			{!upcoming && (
				<Button
					disabled={false}
					size='medium'
					variant='outlined'
					style={{ margin: "10px", color: "#1976d2" }}
					onClick={handleUpcomingClick}
				>
					Upcoming Appointments
				</Button>
			)}
			{upcoming && (
				<Button
					disabled={false}
					size='medium'
					variant='filled'
					style={{ margin: "10px", color: "white", background: "#1976d2" }}
					onClick={handleUpcomingClick}
				>
					Upcoming Appointments
				</Button>
			)}

			<br />
			<form onSubmit={handleSubmit}>
				<Grid item xs={12} style={{ padding: "5px" }}>
					{/* <TextField id="status" name="status" label="Status" variant="outlined" value={ status } onChange={ handleChange } size="small"/> */}
					{/* <Select
                        id="status" 
                        name="status" 
                        label="Status"
                        variant="outlined" 
                        size="small"
                        value={status}
                        onChange={handleChange}
                    >
                        {statEnum.map((option) => (
                            <MenuItem key={ option } value={ option }>
                                { option }
                            </MenuItem>
                        ))}
                    </Select> */}
					<FormControl
						fullWidth
						variant='outlined'
						size='small'
						style={{ minWidth: "5vw", width: "auto" }}
					>
						<InputLabel id='status-label'>Status</InputLabel>
						<Select
							labelId='status-label'
							id='status'
							name='status'
							label='Status'
							variant='outlined'
							size='small'
							value={status}
							onChange={handleChange}
						>
							{statEnum.map((option) => (
								<MenuItem key={option} value={option}>
									{option}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						id='from'
						name='from'
						label='From'
						variant='outlined'
						value={from}
						onChange={handleChange}
						size='small'
						type='date'
						InputLabelProps={{ shrink: true }}
					/>
					<TextField
						id='to'
						name='to'
						label='To'
						variant='outlined'
						value={to}
						onChange={handleChange}
						size='small'
						type='date'
						InputLabelProps={{ shrink: true }}
					/>
					<Button variant='contained' type='submit'>
						Filter
					</Button>
				</Grid>
			</form>

			{isPending && <div>Loading...</div>}
			{error && <div>{error}</div>}
			{!isPending && !error && appointments.length < 1 && (
				<div>No appointments to show...</div>
			)}
			{appointments.length > 0 && (
				<Grid
					container
					direction='column'
					justifyContent='center'
					alignItems='flex-start'
					spacing={3}
				>
					{appointments.map((appointment) => (
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							key={
								appointment.appointmentId
									? appointment.appointmentId
									: appointment._id
							}
						>
							<div>
								{/* <Link to={`/selectedPatient/${patient._id}`} style={{ textDecoration: 'none' }}> */}
								<Item>
									<Typography variant='h6' style={{ color: "black" }}>
										Patient:{" "}
										{appointment.patientFirstName
											? `${appointment.patientFirstName} ${appointment.patientLastName}`
											: `${appointment.firstName} ${appointment.lastName}`}
									</Typography>
									<Typography variant='body2' style={{ color: "black" }}>
										{`Date: ${new Date(appointment.date).toLocaleDateString()}`}
									</Typography>
									<Typography variant='body2' style={{ color: "black" }}>
										{`Time: ${new Date(appointment.date).toLocaleTimeString(
											[],
											{ hour: "2-digit", minute: "2-digit" }
										)}`}
									</Typography>
									<Typography variant='body2' style={{ color: "black" }}>
										Status: {appointment.status}
									</Typography>
									<Typography variant='body2' style={{ color: "black" }}>
										Follow up: {appointment.followUp ? "Yes" : "No"}
									</Typography>
									{appointment.status === "confirmed" &&
										!appointment.followUp && (
											<div>
												<TextField
													id={`followUpDate-${appointment._id}`}
													name={`followUpDate-${appointment._id}`}
													label='Follow-up Date'
													type='date'
													value={followUpDate}
													onChange={handleFollowUpDateChange}
													InputLabelProps={{ shrink: true }}
												/>
												<Button
													variant='outlined'
													size='small'
													onClick={() =>
														scheduleFollowupHandler(
															appointment.doctorId,
															appointment.patientId,
															appointment._id,
															followUpDate
														)
													}
												>
													Schedule Follow-up
												</Button>
											</div>
										)}
								</Item>
								{/* </Link> */}
							</div>
						</Grid>
					))}
				</Grid>
			)}
		</div>
	);
};

export default DoctorApps;
