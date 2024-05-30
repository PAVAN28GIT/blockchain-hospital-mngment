// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract MedicalRecord {
    struct Record {
        string patientID;
        string dataHash;
        uint timestamp;
        uint age; // Additional patient details
        string gender; // Additional patient details
        string diagnosis; // Additional patient details
    }

    mapping(string => Record[]) public records;
    mapping(string => address) public patientToDoctor;
    mapping(string => bool) public isPatientRegistered; // Added mapping to track patient registration

    // Function to register a new patient
    function registerPatient(string memory patientID) public {
        require(!isPatientRegistered[patientID], "Patient already registered");
        isPatientRegistered[patientID] = true;
    }

    // Function to set a doctor for a new patient
    function setDoctorForPatient(
        string memory patientID,
        address doctor
    ) public {
        require(isPatientRegistered[patientID], "Patient not registered");
        require(
            patientToDoctor[patientID] == address(0),
            "Doctor already set for patient"
        );
        require(patientToDoctor[patientID] == msg.sender);
        patientToDoctor[patientID] = doctor;
    }

    // Function to change doctor for a patient
    function changeDoctorForPatient(
        string memory patientID,
        address newDoctor
    ) public {
        require(isPatientRegistered[patientID], "Patient not registered");
        require(
            patientToDoctor[patientID] != address(0),
            "Doctor not set for patient"
        );
        patientToDoctor[patientID] = newDoctor;
    }

    // Function to add a medical record
    function addRecord(
        string memory patientID,
        string memory dataHash,
        uint age,
        string memory gender,
        string memory diagnosis
    ) public {
        require(patientToDoctor[patientID] == msg.sender, "Not authorized");
        records[patientID].push(
            Record(patientID, dataHash, block.timestamp, age, gender, diagnosis)
        );
    }

    // Function to get medical records for a patient
    function getRecords(
        string memory patientID
    ) public view returns (Record[] memory) {
        require(patientToDoctor[patientID] == msg.sender, "Not authorized");
        return records[patientID];
    }
}
