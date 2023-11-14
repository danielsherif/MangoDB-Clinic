import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PasswordIcon from "@mui/icons-material/Password";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Copyright(props) {
	return (
		<Typography
			variant='body2'
			color='text.secondary'
			align='center'
			{...props}
		>
			{"Copyright © "}
			<Link color='inherit' href='https://mui.com/'>
				El7a2ny
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const defaultTheme = createTheme();

export default function ChangePasswordDoctor() {
	const navigate = useNavigate();
	const [formData, setFormData] = React.useState({
		oldPassword: "",
		password: "",
		confirmPassword: "",
	});

	const [isLoading, setIsLoading] = React.useState(false);

	const getEmail = async () => {
		try {
			const response = await axios.get("http://localhost:4000/doctor/myInfo", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			return response.data.email;
		} catch (error) {}
	};

	const handleChange = async () => {
		try {
			setIsLoading(true);

			const response = await axios.post(
				"http://localhost:4000/doctor/reset-password",
				{
					email: await getEmail(),
					password: formData.password,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			if (response.status === 200) {
				alert("Password Changed Successfully");
				navigate("/doctor/login");
			}
		} catch (error) {
			alert("Error Changing Password");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		handleChange();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				{isLoading ? (
					<Spinner />
				) : (
					<>
						<Box
							sx={{
								marginTop: 8,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
								<PasswordIcon />
							</Avatar>
							<Typography component='h1' variant='h5'>
								Change Password
							</Typography>
							<Box
								component='form'
								onSubmit={handleSubmit}
								noValidate
								sx={{ mt: 1 }}
							>
								<TextField
									margin='normal'
									required
									fullWidth
									id='oldPassword'
									label='Old Password'
									name='oldPassword'
									type='password'
									value={formData.oldPassword}
									onChange={handleInputChange}
									autoFocus
								/>
								<TextField
									margin='normal'
									required
									fullWidth
									name='password'
									label='New Password'
									value={formData.password}
									onChange={handleInputChange}
									type='password'
									id='password'
								/>
								<TextField
									margin='normal'
									required
									fullWidth
									name='confirmPassword'
									label='Confirm Password'
									value={formData.confirmPassword}
									onChange={handleInputChange}
									type='password'
									id='confirmPassword'
								/>
								<Button
									type='submit'
									fullWidth
									variant='contained'
									sx={{ mt: 3, mb: 2 }}
								>
									Change Password
								</Button>
							</Box>
						</Box>
					</>
				)}
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
}