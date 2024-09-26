import './App.css';
import React, { useState } from "react";
import { Box, Button, TextField, Select, MenuItem, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function App() {
  const schemaOptions = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ];

  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState([...schemaOptions]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleAddSchema = (schemaValue) => {
    const schema = schemaOptions.find((s) => s.value === schemaValue);
    if (schema) {
      setSelectedSchemas((prev) => [...prev, schema]);
      setAvailableSchemas((prev) => prev.filter((s) => s.value !== schemaValue));
    }
  };

  const handleRemoveSchema = (index) => {
    const removedSchema = selectedSchemas[index];
    setSelectedSchemas((prev) => prev.filter((_, i) => i !== index));
    setAvailableSchemas((prev) => [...prev, removedSchema]);
  };

  const handleSaveSegment = async () => {
    if (!segmentName) {
      alert("Please enter name of the Segment");
    } else {
      const payload = {
        segment_name: segmentName,
        schema: selectedSchemas.map((s) => ({ [s.value]: s.label })),
      };

      try {
        await axios.post('https://thingproxy.freeboard.io/fetch/https://webhook.site/d552efa6-6557-453b-bca5-8082f7e398d7', payload, {
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
          },
        });
        alert("Data sent Successfully");
      } catch (error) {
        alert('Error sending data:');
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset state variables
    setSegmentName("");
    setSelectedSchemas([]);
    setAvailableSchemas([...schemaOptions]);
  };

  return (
    <div className="App">
      <div>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Save segment
        </Button>

        <Dialog
          open={open}
          onClose={handleClose} // Remove Transition for debugging
          maxWidth="sm"
          fullScreen
          PaperProps={{
            sx: {
              position: "fixed",
              right: 0,
              height: "100%",
              maxWidth: "400px",
              width: "100%",
            }
          }}
        >
          <div style={{ background: "#45b0c0", color: 'white' }}>
            <DialogTitle>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="back">
                <ArrowBackIcon />
              </IconButton>
              Saving Segment
            </DialogTitle>
          </div>

          <DialogContent>
            {"Enter the Name of the Segment"}
            <TextField
              placeholder=" Name of the Segment"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              fullWidth
              margin="normal"
              onFocus={(e) => e.stopPropagation()} // Prevents the dialog from closing when focusing
            />
            <p className='mt-[10px]'>{"To save your segment, you need to add the schemas to build the query"}</p>

            {selectedSchemas.length > 0 &&
              <Box sx={{
                border: '2px solid #a6d2f3', // Change this to your desired color and width
                borderRadius: '2px', // Optional: for rounded corners
                p: 2, // Padding inside the box
                backgroundColor: 'transparent', // Background color
              }}>
                {selectedSchemas.map((schema, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Select
                      value={schema.value}
                      onChange={(e) => {
                        const newSchemaValue = e.target.value;
                        const updatedSchemas = [...selectedSchemas];
                        updatedSchemas[index] = schemaOptions.find((s) => s.value === newSchemaValue);
                        setSelectedSchemas(updatedSchemas);
                        setAvailableSchemas(
                          schemaOptions.filter(
                            (s) => !updatedSchemas.some((sel) => sel.value === s.value)
                          )
                        );
                      }}
                      fullWidth
                    >
                      {availableSchemas.concat(schema).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <IconButton color="secondary" onClick={() => handleRemoveSchema(index)}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            }
            <br></br>

            <Select
              value=""
              onChange={(e) => handleAddSchema(e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>Add schema to segment</MenuItem>
              {availableSchemas.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

            <Button style={{ color: "#20b39a" }} startIcon={<AddIcon />} sx={{ mt: 1 }} disabled>
              Add new schema
            </Button>
          </DialogContent>

          <DialogActions>
            <Button style={{ background: "#20b39a" }} variant="contained" color="primary" onClick={handleSaveSegment}>
              Save the Segment
            </Button>
            <Button onClick={handleClose} style={{ background: "white", color: "red" }} variant="contained">Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
