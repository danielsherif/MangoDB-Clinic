import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	Paper,
	Typography,
} from "@mui/material";

import { addPatient } from "../../services/api";

const PatientForm = () => {
	const [username, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [dob, setDOB] = useState("");
	const [nationalID, setNationalID] = useState("");
	const [gender, setGender] = useState("");
	const [mobile, setMobile] = useState("");
	const [emergencyContact, setEmergencyContact] = useState({
		name: "",
		mobile: "",
	});
	const [isPending, setIsPending] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		const patient = {
			username,
			email,
			password,
			firstName,
			lastName,
			dob,
			nationalID,
			gender,
			mobile,
			emergencyContact,
		};

		setIsPending(true);

		addPatient(patient)
			.then(() => {
				setIsPending(false);
				alert("Account Created Successfully, Please Login");
				navigate("/login");
			})
			.catch((error) => {
				alert(error.response.data.error);
				setIsPending(false);
			});
	};
	return (
		<Grid container justifyContent='center' style={{ padding: "2rem" }}>
			<Grid item xs={6}>
				<Paper elevation={3} style={{ padding: "2rem" }}>
					<Typography variant='h4' style={{ margin: "1rem" }}>
						Register As Patient
					</Typography>
					<form onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<TextField
									label='First Name'
									type='text'
									fullWidth
									required
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									style={{ marginBottom: "1rem" }}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									label='Last Name'
									type='text'
									fullWidth
									required
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									style={{ marginBottom: "1rem" }}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									label='Username'
									type='text'
									size='large'
									fullWidth
									required
									value={username}
									onChange={(e) => setUserName(e.target.value)}
									style={{ marginBottom: "1rem" }}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									label='Email'
									type='email'
									fullWidth
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									style={{ marginBottom: "1rem" }}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									label='Password'
									type='password'
									required
									fullWidth
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									style={{ marginBottom: "1rem" }}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									label='Date of Birth'
									type='date'
									required
									fullWidth
									value={dob}
									onChange={(e) => setDOB(e.target.value)}
									style={{ marginBottom: "1rem" }}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									label='Mobile Number'
									type='tel'
									required
									fullWidth
									value={mobile}
									onChange={(e) => setMobile(e.target.value)}
									style={{ marginBottom: "1rem" }}
								/>
							</Grid>
							<Grid item xs={6}>
								<FormControl variant='standard' sx={{ m: 1, minWidth: 300 }}>
									<InputLabel id='demo-simple-select-standard-label'>
										Gender
									</InputLabel>
									<Select
										labelId='demo-simple-select-standard-label'
										id='demo-simple-select-standard'
										value={gender}
										onChange={(e) => setGender(e.target.value)}
										fullWidth
										// color='primary'
										style={{ marginBottom: "1rem" }}
									>
										<MenuItem value=''>
											<em>None</em>
										</MenuItem>
										<MenuItem value='male'>Male</MenuItem>
										<MenuItem value='female'>Female</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							<TextField
								label='National ID'
								type='number'
								required
								fullWidth
								value={nationalID}
								onChange={(e) => setNationalID(e.target.value)}
								style={{
									marginTop: "1rem",
									marginBottom: "1rem",
									marginLeft: "1rem",
								}}
							/>
						</Grid>
						<Paper
							elevation={3}
							style={{
								padding: "1rem",
								marginTop: "1rem",
								marginBottom: "2rem",
								marginRight: "1rem",
								marginLeft: "1rem",
							}}
						>
							<Typography variant='h5' style={{ margin: "1rem" }}>
								Emergency Contact Information:
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<TextField
										label='Emergency Contact Name'
										type='text'
										required
										fullWidth
										value={emergencyContact.name}
										onChange={(e) =>
											setEmergencyContact({
												...emergencyContact,
												name: e.target.value,
											})
										}
										// style={{ margin: '1rem' }}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										label='Emergency Contact Mobile Number'
										type='tel'
										required
										fullWidth
										value={emergencyContact.mobile}
										onChange={(e) =>
											setEmergencyContact({
												...emergencyContact,
												mobile: e.target.value,
											})
										}
										// style={{ margin: '1rem' }}
									/>
								</Grid>
							</Grid>
						</Paper>
						{!isPending ? (
							<Button variant='contained' type='submit' fullWidth>
								Register
							</Button>
						) : (
							<Button variant='contained' disabled fullWidth>
								Registering
							</Button>
						)}
					</form>
				</Paper>
			</Grid>
		</Grid>
	);
};

export default PatientForm;
