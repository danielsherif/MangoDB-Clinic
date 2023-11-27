import { useState, useEffect } from "react";
import {
	Dialog,
	Grid,
	DialogContent,
	Paper,
	Card,
	CardContent,
	TextField,
	FormControlLabel,
	Checkbox,
	Tooltip,
	Typography,
	Button,
} from "@mui/material";

import PrescriptionsTable from "../../components/GeneralComponents/PrescriptionsTable";
const ViewPrescriptionsDoctor = () => {

    const firstColumnName = "Patient";
    const [prescriptions, setPrescriptions] = useState([]);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);
    const [patientUsername, setPatientUsername] = useState("");
    const [date, setDate] = useState("");
    const [filled, setFilled] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openFreqDialog, setOpenFreqDialog] = useState(false);
    const [prescriptionToBeUpdated, setPrescriptionToBeUpdated] = useState("");
    const [medicationToBeUpdated, setMedicationToBeUpdated] = useState("");
    const [freqToBeUpdated, setFreqToBeUpdated] = useState("");

    useEffect(() => {
        const fetchData = async () => {
          try {
                setIsPending(true);
                setError(null);

                const token = localStorage.getItem("token");
                // setTimeout(async () => {
                    const response = await fetch(
                    "http://localhost:4000/doctor/viewAllPrescriptionsByDoctor",
                    {
                        method: "GET",
                        headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        },
                    }
                    );
    
                    if (!response.ok) {
                    throw new Error("Could not fetch the data for that resource");
                    }
    
                    const data = await response.json();
                    console.log('Fetched Data:', data);
                    setPrescriptions(data);
                    setIsPending(false);
                    setError(null);
                // }, 10000);
            } catch (err) {
            setIsPending(false);
            setError(err.message);
            }
        };
      fetchData();
    }, [setPrescriptions]);

    const handleAddPrescription = async () => {
        setOpenDialog(false);
		setIsPending(true);
		setError(null);

        const token = localStorage.getItem("token");

        try {
			const response = await fetch("http://localhost:4000/doctor/addPrescription", {
			  method: "POST",
			  headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			  },
              body: JSON.stringify({
                patientName: patientUsername,
                date: date,
                filled: filled,
                }),
			});
		
			if (!response.ok) {
			  throw new Error("Could not fetch the data for that resource");
			}
		
			const newPrescription = await response.json();
            console.log('New Prescription:', newPrescription);

            setPrescriptions((prevPrescriptions) => [...prevPrescriptions, newPrescription]);

			setIsPending(false);
			setError(null);

		  } catch (err) {
			setIsPending(false);
			setError(err.message);
		  }
        setPatientUsername("");
        setDate("");
        setFilled(false);
        alert("Prescription added successfully!");
    };

    const handleEditDosage = async () => {
        setOpenFreqDialog(false);
        setIsPending(true);
        setError(null);

        try {
            const { _id } = prescriptionToBeUpdated;
            const frequency = freqToBeUpdated;
            const medicationName = medicationToBeUpdated ? medicationToBeUpdated.medicationName : '';

            if (!_id || !frequency) {
                console.error("Invalid request parameters");
                console.log("_id:", _id);
                console.log("frequency:", frequency);
                return;
            }

            const updatedPrescription = await fetch(`http://localhost:4000/doctor/addOrUpdateDosage`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prescriptionId: _id,
                    medicationName: medicationName,
                    frequency: frequency,
                }),
            });

            if (!updatedPrescription.ok) {
                throw new Error("Could not update dosage");
            }

            const updatedPrescriptionData = await updatedPrescription.json();
            console.log('Updated Prescription:', updatedPrescriptionData);

            // Now update the state with the new prescription data
            setPrescriptions((prevPrescriptions) =>
                prevPrescriptions.map((prescription) =>
                    prescription._id === updatedPrescriptionData.prescription._id
                        ? updatedPrescriptionData.prescription
                        : prescription
                )
            );
            setIsPending(false);
			setError(null);

        } catch (err) {
            setIsPending(false);
            setError(err.message);
        }
        alert("Dosage Updated successfully!");
    };

    const handleCheckboxChange = (event) => {
		setFilled(event.target.checked);
	};

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleOpenFreqDialog = (prescription, medication) => {
        console.log('Medication:', medication);
        console.log('Prescription:', prescription);
        setMedicationToBeUpdated(medication);
        setPrescriptionToBeUpdated(prescription);
        setOpenFreqDialog(true);
    };

    return ( 
        <Grid container justifyContent='center' style={{ padding: "2rem" }}>
            <Grid item xs={12}>
                <Paper elevation={3} style={{ padding: "2rem" }}>
                    <Grid container spacing={2}>
                        <Typography style={{ margin: "1rem" }} variant='h4' align='left'>
                            List Of Prescriptions
                        </Typography>
                    </Grid>
                    <PrescriptionsTable 
                        firstColumnName={firstColumnName} 
                        data={prescriptions} 
                        userType="doctor"
                        onOpenDialog={handleOpenDialog}
                        onOpenFreqDialog={handleOpenFreqDialog}
                    />
                    {isPending && <div>Loading...</div>}
                    {error && <div>{error}</div>}
                </Paper>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
					<DialogContent>
						<Card variant='outlined'>
							<CardContent>
								<Typography variant='h6' component='div'>
									Insert Prescription
									{/* <Typography variant='body2' component='div'>
										Select only one option
									</Typography> */}
								</Typography>
								<TextField
									id='patient-username'
									label='Patient Username'
									variant='outlined'
                                    required
									value={patientUsername}
									onChange={(e) => setPatientUsername(e.target.value)}
									style={{ margin: "1rem" }}
								/>
								<TextField
									id='date-filter'
									label='Date'
									type='date'
									variant='outlined'
                                    required
									value={date}
									onChange={(e) => setDate(e.target.value)}
									InputLabelProps={{
										shrink: true,
									}}
									style={{ margin: "1rem" }}
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={filled}
											onChange={handleCheckboxChange}
										/>
									}
									label='Filled'
									style={{ margin: "1rem" }}
								/>
								<Button variant='contained' onClick={handleAddPrescription} disabled={!patientUsername || !date}>
									Add
								</Button>
							</CardContent>
						</Card>
					</DialogContent>
				</Dialog>
                <Dialog open={openFreqDialog} onClose={() => setOpenFreqDialog(false)}>
                    <DialogContent>
                        <Card variant='outlined'>
                            <CardContent>
                                <Typography variant='h6' component='div'>
                                    Edit Dosage
                                    {/* <Typography variant='body2' component='div'>
                                        Select only one option
                                    </Typography> */}
                                </Typography>
                                <TextField
                                    id='frequency'
                                    label='Frequency'
                                    variant='outlined'
                                    required
                                    value={freqToBeUpdated}
                                    onChange={(e) => setFreqToBeUpdated(e.target.value)}
                                    style={{ margin: "1rem" }}
                                />
                                <Button variant='contained' onClick={handleEditDosage}>
                                    Edit
                                </Button>
                            </CardContent>
                        </Card>
                    </DialogContent>
                </Dialog>
            </Grid>
        </Grid>
    );
}
 
export default ViewPrescriptionsDoctor;