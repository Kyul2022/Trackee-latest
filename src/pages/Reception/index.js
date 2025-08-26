import React, { useState, useEffect} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import styled from "styled-components";
import { Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoSearch } from "react-icons/io5";
import { dataLiv } from "./dataLiv.js";
import { dataRet } from "./dataRetrait.js";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    height: "20px",
    color: "text-primary",
  };
});

const Reception = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchR, setSearchR] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('livraison');

  const bearerToken = "eyJhbGciOiJIUzUxMiJ9.eyJhZ2VuY2UiOiJZYW91bmRlIiwibWF0cmljdWxlIjoiRkktMDAxIiwic3ViIjoiRkktMDAxIiwiaWF0IjoxNzU2MTkyMTA3LCJleHAiOjE3NTYyMTAxMDd9.BSeJLQCx-EQ2FtTQEWdf9yLFn7rQIRIdADgUotAqMJYEj5AraukCKBCloyoGwh16zgMVOyUQcvpiczmh1pFcmg";

  const [withdrawnStates, setWithdrawnStates] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [openModal, setOpenModal] = useState(false); 
  const [selectedItem, setSelectedItem] = useState(null); 
  const [currentDeliveryId, setCurrentDeliveryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Adjust this value for the number of rows per page

  const [deliveries, setDeliveries] = useState(dataLiv);


    const fetchDeliveries = async () => {
    try {
      
      if (!bearerToken) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await fetch('http://localhost:8080/delivery/arrivee/', {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("first")
      console.log(JSON.stringify(data,2,null))
      setDeliveries(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Erreur lors du chargement des livraisons: ' + err.message);
      setLoading(false);
      
      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        // window.location.href = '/login';
      }
    }
  };

      useEffect(() => {
      fetchDeliveries();
    }, []);

   // Open modal for a specific delivery
   const handleOpenModalDelivery = (id) => {
    setCurrentDeliveryId(id);
    setShowModal(true);
  };

  // Close modal without making any changes
  const handleCloseModalDelivery = () => {
    setShowModal(false);
    setCurrentDeliveryId(null);
  };

    const getDriver = (delivery) => {
    // Mock driver data - replace with actual API call
    return 'KAMDEM';
  };

   // Handle confirmation of delivery state change
   const handleConfirmArrival = () => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) =>
        delivery.id === currentDeliveryId
          ? { ...delivery, state: "Arrivé", action: "Paquets arrivés" }
          : delivery
      )
    );
    setShowModal(false);
    setCurrentDeliveryId(null);
  };

    // Pagination calculations
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentDeliveries = deliveries
      .filter((item) => {
        return search.toLowerCase() === ""
          ? item
          : item.destination.toLowerCase().includes(search);
      })
      .slice(indexOfFirstRow, indexOfLastRow);
  
    // Handle page change
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };

  const handleOpenModal = (itemR) => {
    setSelectedItem(itemR); 
    setOpenModal(true); 
  };

  const handleConfirmWithdrawn = () => {
    if (selectedItem) {
      setWithdrawnStates((prevStates) => ({
        ...prevStates,
        [selectedItem.id]: true,
      }));
      setOpenModal(false); 
      setSelectedItem(null); 
    }
  };

  
  const handleCloseModal = () => {
    setOpenModal(false); 
    setSelectedItem(null); 
  };

  
  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 d-flex justify-content-between align-items-center flex-row p-4">
          <h5 className="mb-0">Reception</h5>
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
            <StyledBreadcrumb
              className="styledbreadcrumbs"
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />

            <StyledBreadcrumb
              className="styledbreadcrumbs"
              label="Reception"
              href="#"
              deleteIcon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>



        <div class="container">
          <div class="row">

            <div className="col-lg-12">
              <div className="card z-depth-3">
                <div className="card-body">
                  <ul className="nav nav-pills nav-pills-primary nav-justified">
                    <li className="nav-item d-flex">
                      <Button
                        onClick={() => setActiveTab('livraison')}
                        style={{
                          backgroundColor: activeTab === 'livraison' ? '#20948B' : 'transparent',
                          color: activeTab === 'livraison' ? 'white' : 'black',
                        }}
                        className={`nav-link ${activeTab === 'livraison' ? 'active show' : ''}`}
                      >
                        <i className="icon-user"></i> <span className="hidden-xs">Livraisons en Cours</span>
                      </Button>

                      <Button
                        onClick={() => setActiveTab('retrait')}
                        style={{
                          backgroundColor: activeTab === 'retrait' ? '#20948B' : 'transparent',
                          color: activeTab === 'retrait' ? 'white' : 'black',
                        }}
                        className={`nav-link ${activeTab === 'retrait' ? 'active show' : ''}`}
                      >
                        <i className="icon-envelope-open"></i> <span className="hidden-xs">Retrait colis</span>
                      </Button>

                    </li>
                  </ul>

                  <div className="tab-content p-3">
                    {activeTab === 'livraison' && (
                      <div className="tab-pane active show" id="livraison">
                        <div className="card shadow border-0 p-3 mt-4">
                          <div className="d-flex align-items-center justify-content-between">
                            <h3 className="hd">Table des Livraisons</h3>

                            <div className="searchBox position-relative d-flex align-items-center">
                              <IoSearch className="mr-2" />
                              <input
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                placeholder="Rechercher ici..."
                                className="text-black"
                              />
                            </div>
                          </div>

                          {/*responsive table livraison*/}

                          <div className="table-responsive mt-4">
        <table className="table table-bordered v-align">
          <thead className="thead-dark">
            <tr>
              <th>UID Livraison</th>
              <th>Destination</th>
              <th>Source</th>
              <th>Matricule Bus</th>
              <th>Chauffeur Bus</th>
              <th>Date Départ</th>
              <th>Etat de la Livraison</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentDeliveries.map((item) => (
              <tr key={item.id}>
                <td>{item.labelLivraison}</td>
                <td>{item.villeArrivee}</td>
                <td>{item.villeDepart}</td>
                <td>{item.bus?.matricule}</td>
                <td>{getDriver(item)}</td>
                <td>{formatDate(item.depart)}</td>
                <td className="actionsBtn justify-content-center">
                  <Button
                    className={item.state === "Arrivé" ? "btn-error" : "btn-yellow"}
                    disabled={item.state === "Arrivé"} 
                  >
                    {item.state}
                  </Button>
                </td>

                <td className="actionsBtn justify-content-center">
                  <Button
                    color="success"
                    className="btn-gray"
                    onClick={() => handleOpenModalDelivery(item.id)}
                    disabled={item.state === "Arrivé"} // Disable action if already "Arrivé"
                  >
                    {item.action}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex tableFooter">
          <p>
            Showing <b>{currentDeliveries.length}</b> of <b>{deliveries.length}</b>{" "}
            results
          </p>
          <Pagination
            count={Math.ceil(deliveries.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="success"
            className="pagination"
            showFirstButton
            showLastButton
          />
        </div>
      </div>

      {/* Modal for Confirming Arrival */}
      <Modal show={showModal} onHide={handleCloseModalDelivery}>
        <Modal.Header closeButton>
        <Modal.Title>Confirmer l'arrivée</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          Êtes-vous sûr de vouloir marquer cette livraison comme "Arrivé"?
        </Modal.Body>
        <Modal.Footer>
          <Button color="error" onClick={handleCloseModalDelivery}>
            Annuler
          </Button>
          <Button color="success" onClick={handleConfirmArrival}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
      
                        </div>
                      </div>
                    )}
                    {activeTab === 'retrait' && (
                      <div className="tab-pane active show" id="retrait">
                        <div className="card shadow border-0 p-3 mt-4">
                          <div className="d-flex align-items-center justify-content-between">
                            <h3 className="hd">Retrait des colis</h3>

                            <div className="searchBox position-relative d-flex align-items-center">
                              <IoSearch className="mr-2" />
                              <input
                                onChange={(e) => setSearchR(e.target.value)}
                                type="text"
                                placeholder="Rechercher ici..."
                                className="text-black"
                              />
                            </div>
                          </div>

                          {/*responsive table retait des colis*/}
                          <div className="table-responsive mt-4">
                            <table className="table table-bordered v-align">
                              <thead className="thead-dark">
                                <tr>
                                  <th>UID</th>
                                  <th>ID COLIS</th>
                                  <th>ID LIVRAISON</th>
                                  <th>VILLE DEPART</th>
                                  <th>VILLE DESTINATRICE</th>
                                  <th>EXPEDITEUR</th>
                                  <th>DESTINATAIRE</th>
                                  <th>TYPE DE COLIS</th>
                                  <th>ETATS</th>
                                  <th>ACTIONS</th>
                                </tr>
                              </thead>

                              <tbody>
                                {dataRet
                                  .filter((itemR) => {
                                    return searchR.toLowerCase() === ""
                                      ? itemR
                                      : itemR.id_colis.toLowerCase().includes(searchR);
                                  })
                                  .map((itemR) => (
                                    <tr key={itemR.id}>
                                      <td>{itemR.id}</td>
                                      <td>{itemR.id_colis}</td>
                                      <td>{itemR.id_livraison}</td>
                                      <td>{itemR.ville_depart}</td>
                                      <td>{itemR.ville_destinatrice}</td>
                                      <td>{itemR.expediteur}</td>
                                      <td>{itemR.destinataire}</td>
                                      <td>{itemR.type_colis}</td>
                                      <td className="actionsBtn justify-content-center">
                                        <Button
                                          color="success"
                                          className={`${withdrawnStates[itemR.id] ? "btn-error" : "btn-green"
                                            }`}
                                        >
                                          {withdrawnStates[itemR.id]
                                            ? "Indisponible"
                                            : itemR.etat}
                                        </Button>
                                      </td>
                                      <td className="actionsBtn justify-content-center">
                                        <Button
                                          onClick={() => handleOpenModal(itemR)}
                                          color="success"
                                          disabled={withdrawnStates[itemR.id]} // Disable if already withdrawn
                                          className={`${withdrawnStates[itemR.id] ? "btn-error" : "btn-green"
                                            }`}
                                        >
                                          {withdrawnStates[itemR.id] ? "Déjà retiré" : itemR.actions}
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                            <div className="d-flex tableFooter">
                              <p>
                                Showing <b>5 </b> of <b>20 </b> results
                              </p>
                              <Pagination
                                count={20}
                                color="success"
                                className="pagination"
                                showFirstButton
                                showLastButton
                              />
                            </div>
                          </div>

                          <Dialog
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="withdrawal-confirmation-title"
                            aria-describedby="withdrawal-confirmation-description"
                          >
                            <DialogTitle id="withdrawal-confirmation-title">
                              {"Confirmer le Retrait du Colis"}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="withdrawal-confirmation-description">
                                Êtes-vous sûr de vouloir retirer ce colis ? Cette action est irréversible.
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleCloseModal} color="error">
                                Annuler
                              </Button>
                              <Button onClick={handleConfirmWithdrawn} color="success" autoFocus>
                                Confirmer
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  );
};

export default Reception;
