async function fetchContractABI() {
    const response = await fetch('contractABI.json'); // Make sure the ABI JSON file is in the same directory
    const data = await response.json();
    return data.abi; // Return only the ABI array
}

// Function to initialize the contract, MetaMask, and fetch contract ABI
async function initContractAndMetaMask() {
    if (!window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask to interact with this website.");
        return null;
    }

    try {
        // Request permission to access user's MetaMask accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "0x2344B19323926B555f6A88293364056FF90CeC32"; // Replace with your actual contract address
        const contractABI = await fetchContractABI();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        return contract;
    } catch (error) {
        console.error(error);
        alert("Error initializing contract and MetaMask: " + error.message);
        return null;
    }
}


// Function to register a new patient
async function registerPatient() {
    const contract = await initContractAndMetaMask();
    if (!contract) return;

    const patientID = document.getElementById("patientIDRegister").value;

    try {
        const tx = await contract.registerPatient(patientID);
        await tx.wait(); // Wait for the transaction to be mined

        alert("Patient registered successfully!");
    } catch (error) {
        console.error(error);
        alert("Error registering patient: " + error.message);
    }
}

// Function to set a doctor for a patient
async function setDoctorForPatient() {
    const contract = await initContractAndMetaMask();
    if (!contract) return;

    const patientID = document.getElementById("patientIDSetDoctor").value;
    const doctorAddress = document.getElementById("doctorAddressSetDoctor").value;

    try {
        const tx = await contract.setDoctorForPatient(patientID, doctorAddress);
        await tx.wait(); // Wait for the transaction to be mined

        alert("Doctor set successfully!");
    } catch (error) {
        console.error(error);
        alert("Error setting doctor: " + error.message);
    }
}


// Function to change doctor for a patient
async function changeDoctor() {
    const contract = await initContractAndMetaMask();
    if (!contract) return;

    const patientID = document.getElementById("patientIDChange").value;
    const newDoctorAddress = document.getElementById("newDoctorAddress").value;

    try {
        const tx = await contract.changeDoctorForPatient(patientID, newDoctorAddress);
        await tx.wait(); // Wait for the transaction to be mined

        alert("Doctor changed successfully!");
    } catch (error) {
        console.error(error);
        alert("Error changing doctor: " + error.message);
    }
}

// Function to add a medical record
async function addRecord() {
    const contract = await initContractAndMetaMask();
    if (!contract) return;

    const patientID = document.getElementById("patientIDAdd").value;
    const dataHash = document.getElementById("dataHash").value;
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const diagnosis = document.getElementById("diagnosis").value;

    try {
        const tx = await contract.addRecord(patientID, dataHash, age, gender, diagnosis);
        await tx.wait(); // Wait for the transaction to be mined

        alert("Medical record added successfully!");
    } catch (error) {
        console.error(error);
        alert("Error adding medical record: " + error.message);
    }
}
// Function to fetch medical records for a patient
async function getRecords() {
    const contract = await initContractAndMetaMask();
    if (!contract) return;

    const patientID = document.getElementById("patientIDGet").value;

    try {
        const records = await contract.getRecords(patientID);
        let formattedInfo = "";

        // Loop through each record and format the information
        records.forEach(record => {
            formattedInfo += `
                patientID: ${record.patientID} <br>
                Data hash: ${record.dataHash} <br>
                Timestamp: ${new Date(record.timestamp * 1000)} <br>
                Age: ${record.age} <br>
                Gender: ${record.gender} <br>
                Diagnosis: ${record.diagnosis} <br>
                <br>
            `;
        });

        // Display the formatted information on the webpage
        document.getElementById("records").innerHTML = formattedInfo;
        console.log("Fetched records:", records);
    } catch (error) {
        console.error(error);
        alert("Error fetching records: " + error.message);
    }
}

