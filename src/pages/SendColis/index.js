import React, { useState, useEffect} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import styled from 'styled-components'
import { Chip } from '@mui/material'
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import Logo from '../../assets/images/logo-64.png'


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        height: '20px',
        color: 'text-primary'
    }
});


const SendColis = () => {
    
      const { deliveryId } = useParams();

    const [categoryVal, setCategoryVal] = useState('');
      const [apiResults, setApiResults] = useState([]);
        const bearerToken = "eyJhbGciOiJIUzUxMiJ9.eyJhZ2VuY2UiOiJZYW91bmRlIiwibWF0cmljdWxlIjoiRkktMDAxIiwic3ViIjoiRkktMDAxIiwiaWF0IjoxNzU2MTExNzA2LCJleHAiOjE3NTYxMjk3MDZ9.GR_sPS0QJfEkOFcWpIyAYVxjg_8Nre2mPv89YcYscyEdsrsbga5H_9rGsuhfyp2UQXwNGnhUIxRpF_WZgX37GA";

const handleChangeDest = (event) => {
    setFormData(prev => ({
        ...prev,
        destination: event.target.value // Update formData.destination
    }));
};

const handleChangeNature = (event) => {
    setFormData(prev => ({
        ...prev,
        nature: event.target.value // Update formData.destination
    }));
};

const handleChangeExpNum = (event) => {
    setFormData(prev => ({
        ...prev,
        exp_number: event.target.value // Update formData.destination
    }));
};

const handleChangeDestNum1 = (event) => {
    setFormData(prev => ({
        ...prev,
        dest_number1: event.target.value // Update formData.destination
    }));
};

const handleChangeDestNum2 = (event) => {
    setFormData(prev => ({
        ...prev,
        dest_number2: event.target.value // Update formData.destination
    }));
};

const handleChangeDescription = (event) => {
    setFormData(prev => ({
        ...prev,
        description: event.target.value // Update formData.destination
    }));
};


    const [formData, setFormData] = useState({
    exp_number: '',
    dest_number1: '',
    dest_number2: '',
    description: '',
    nature: '',
    type: '',
    destination: ''
  });

  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



    // Make API call with form parameters
const handleSubmit = async () => {
  setLoading(true);
  setError(null);

  try {
    // Get the delivery ID (assuming it's available in your component)
    // This could come from useParams() if passed via route, or from props/state    
    // Prepare the package data based on your Package model
    const packageData = {
      exp_number: formData.exp_number,
      dest_number1: formData.dest_number1,
      dest_number2: formData.dest_number2,
      description: formData.description,
      nature: formData.nature,
      type: formData.type,
      destination: formData.destination,
      // Note: numSerie, status, activeDelivery, and deliveriesPassedBy 
      // will be set by the backend, so we don't include them
    };

    const apiUrl = `http://localhost:8080/package/${deliveryId}`;
    console.log('API URL:', apiUrl);
    console.log('Package Data:', packageData);

    const response = await fetch(apiUrl, {
      method: 'POST', // Changed from GET to POST
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(packageData), // Added request body
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text(); // For "Package added successfully" message
    }

    setApiResults(data);
    console.log('API Results:', data);
    
    // Optional: Show success message
    alert('Colis ajouté avec succès!');
    
    // Optional: Reset form or redirect
    // resetForm();
    // navigate('/deliveries');
    
  } catch (err) {
    setError(err.message);
    console.error('API Error:', err);
    
    // Show user-friendly error message
    if (err.message.includes('404')) {
      alert('Livraison non trouvée');
    } else if (err.message.includes('500')) {
      alert('Erreur serveur lors de l\'ajout du colis');
    } else {
      alert('Erreur lors de l\'ajout du colis: ' + err.message);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const fetchAgencies = async () => {
      if (!bearerToken) {
        setError('Bearer token is required');
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:8080/agencies', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract city names (ville) from the API response
        let cityNames = [];
        
        if (Array.isArray(data)) {
          // Extract ville from each object
          cityNames = data.map(item => item.ville).filter(ville => ville);
        } else if (data.agencies && Array.isArray(data.agencies)) {
          cityNames = data.agencies.map(item => item.ville).filter(ville => ville);
        } else if (data.data && Array.isArray(data.data)) {
          cityNames = data.data.map(item => item.ville).filter(ville => ville);
        } else {
          throw new Error('Invalid API response format');
        }
        
        setAgencies(cityNames);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching agencies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, [bearerToken]);

    return (
        <>
            <div className='right-content w-100'>
                <div className='card shadow border-0 w-100 d-flex flex-row p-4'>
                    <h5 className='mb-0'>Envoi de colis</h5>
                    <Breadcrumbs aria-label='breadcrumb' className='breadcrumbs'>
                        <StyledBreadcrumb
                            className='styledbreadcrumbs'
                            component="a"
                            href="/"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />


                        <StyledBreadcrumb
                            className='styledbreadcrumbs'
                            label="Form"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>
                <form>

                    <div className='row'>
                        <div className='col-sm-12 col-md-7'>
                            <div className='card p-4'>
                                <div className='headpage'>
                                    <h5>Veuillez renseigner les champs ci-dessous</h5>

                                    <Button className='red btn-lg btn-round'>Annuler</Button>

                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>DESTINATION</h6>
                                            <select
                                                value={formData.destination}
                                                onChange={handleChangeDest}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                               <option value="" disabled>
        {loading ? 'Loading agencies...' : 'Select Agency'}
      </option>
      {agencies.map((agencyName, index) => (
        <option key={index} value={agencyName}>
          {agencyName}
        </option>
      ))}
    </select>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>NATURE</h6>
                                            <Select
                                                value={formData.nature}
                                                onChange={handleChangeNature}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">

                                                </MenuItem>
                                                <MenuItem value="COURRIER">COURRIER</MenuItem>
                                                <MenuItem value="COLIS">COLIS</MenuItem>
                                                <MenuItem value="DEPECHE">DEPECHE</MenuItem>

                                            </Select>
                                        </div>
                                    </div>

                                </div>
                                <div className='form-group'>
                                    <h6>DESCRIPTION</h6>
                                    <input type='text' value = {formData.description}  onChange={handleChangeDescription}/>
                                </div>
                                <div className='form-group'>
                                    <h6>PRIX</h6>
                                    <input type='number'/>
                                </div>
                                <div className='form-group'>
                                    <h6>POIDS(kg)</h6>
                                    <input type='number'/>
                                </div>
                                <div className='form-group'>
                                    <h6>NOM DE L'EXPEDITEUR</h6>
                                    <input type='text'/>
                                </div>
                                <div className='form-group'>
                                    <h6>NUMERO DE L'EXPEDITEUR</h6>
                                    <input type='number' value = {formData.exp_number} onChange={handleChangeExpNum}/>
                                </div>
                                <div className='form-group'>
                                    <h6>NOM DU DESTINATAIRE</h6>
                                    <input type='text' />
                                </div>
                                <div className='form-group'>
                                    <h6>NUMERO DU DESTINATAIRE</h6>
                                    <input type='number' value = {formData.dest_number1}  onChange={handleChangeDestNum1}/>
                                </div>
                                <div className='form-group'>
                                    <h6>NUMERO DU DESTINATAIRE SECONDAIRE</h6>
                                    <input type='number' value = {formData.dest_number2} onChange={handleChangeDestNum2}/>
                                </div>

                                <button type="submit" class=" btn btn-success" onClick = {handleSubmit}>Enregistrer</button>
                            </div>
                        </div>

                        <div className='col-sm-12 col-md-5'>

                            <div class="card">
                                <div class="card-body">
                                    <div class="text-center ">
                                        <div class="logo align-items-center">
                                            <img src={Logo} alt="" />
                                            <span class="d-none d-lg-block ">TRACKEE</span>
                                        </div>

                                    </div>

                                    <h5 class="card-title text-center">Facture de Livraison</h5>
                                    <table class="table table-bordered justify-content-center" >
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Données</th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr>
                                                <th scope="row">ID Colis</th>
                                                <td >AAAA</td>

                                            </tr>

                                            <tr>
                                                <th scope="row">Nature du colis </th>
                                                <td >10/8/2023</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Destination</th>
                                                <td >AG_DLA_MBOPPI</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">FRAIS</th>
                                                <td >2000 XAF</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Nom Expéditeur</th>
                                                <td>Tamo</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Télephone Expéditeur</th>
                                                <td>19558880</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Nom Destinataire</th>
                                                <td>Patrick</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">téléphone Destinataire</th>
                                                <td>10:31</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Date de l'expédition</th>
                                                <td >11/8/2024</td>

                                            </tr>
                                          
                                            <tr>
                                                <th scope="row">téléphone Destinataire</th>
                                                <td>10:31</td>

                                            </tr>

                                        </tbody>

                                         qr code ici
                                    </table>

                                    <button type="submit" class=" btn btn-primary w-100">Imprimer Facture</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </>
    )
}


export default SendColis
