/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@material-tailwind/react";
import { IoAdd } from "react-icons/io5";
import FormAddTrack from "./components/FormAddTrack";
import FormEditTrack from "./components/FormEditTrack";
import Modal from "./components/Modal";
import CardList from "./components/CardList";
import useApi from "./hook/UseAuth";
import { sectorConstant, ITEMS_PER_PAGE } from "./utils/utils";
import Pagination from "./components/Pagination";

const SectorTracking = () => {
  const { get, post, del, put } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSector, setSelectedSector] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectors, setSectors] = useState([]);
  const [strategicGoals, setStrategicGoals] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usernames, setUsernames] = useState({});

  const fetchSectors = async () => {
    try {
      const sectorData = await get("userApp/sector/");
      setSectors(sectorData);
    } catch (error) {
      setError(error);
    }
  };

  const fetchUsernameById = (id) => {
    return get(`userApp/sector/${id}`)
      .then((userData) => userData.name)
      .catch((error) => {
        console.error(error);
        return null;
      });
  };

  const fetchStrategicGoals = async () => {
    try {
      const strategicGoalData = await get("planApp/strategicGoals/");
      setStrategicGoals(strategicGoalData);
    } catch (error) {
      setError(error);
    }
  };

  const fetchtrackes = async () => {
    try {
      const trackData = await get("tracking/trackSector/");
      setTracks(trackData);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchSectors();
      await fetchStrategicGoals();
      await fetchtrackes();
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(tracks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = tracks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCardClick = async (sector) => {
    try {
      const trackDetails = await get(`tracking/trackSector/${sector.id}`);
      setSelectedSector(trackDetails);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching track details:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      const newUsernames = {};
      for (const sector of currentItems) {
        if (!usernames[sector.sector]) {
          const name = await fetchUsernameById(sector.sector);
          newUsernames[sector.sector] = name || sector.sector;
        }
      }
      if (Object.keys(newUsernames).length > 0) {
        setUsernames((prevUsernames) => ({
          ...prevUsernames,
          ...newUsernames,
        }));
      }
    };

    fetchUsernames();
  }, [currentItems]);

  const handleFormSubmit = (data) => {
    if (new Date(data.start_date) > new Date(data.end_date)) {
      alert("Start date cannot be greater than end date.");
      return;
    }
    post("tracking/trackSector/", data)
      .then((response) => {
        fetchtrackes();
      })
      .catch((error) => {
        console.error("Error posting data:", error.response.data);
      });
  };

  const handleEditSubmit = (data) => {
    if (new Date(data.start_date) > new Date(data.end_date)) {
      alert("Start date cannot be greater than end date.");
      return;
    }
    put(`tracking/trackSector/${data.id}/`, data)
      .then((response) => {
        setShowEditModal(false);
        fetchtrackes();
      })
      .catch((error) => {
        console.error("Error updating data:", error.response.data);
      });
  };

  const handleDeleteTrack = (trackId) => {
    del(`tracking/trackSector/${trackId}`)
      .then((response) => {
        fetchtrackes();
      })
      .catch((error) => {
        console.error("Error deleting track:", error.response.data);
      });
  };

  return (
    <>
      <div className="grid gap-3 items-center">
        <h1 className="whitespace-nowrap text-left text-xl font-bold text-black">
          Tracking List
        </h1>
        <Card className="rounded-md">
          <CardBody className="flex flex-col space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button className="px-4 py-2 text-black focus:outline-none">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Search for ..."
                    className="px-4 py-2 flex-grow focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#3B82F6] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex space-x-2"
                >
                  <IoAdd /> <p>Add Tracking</p>
                </button>
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                  <FormAddTrack
                    heading={sectorConstant.heading}
                    assigned_to={sectorConstant.assigned_to}
                    assigned_to_label={sectorConstant.assigned_to_label}
                    task_to_assign={sectorConstant.task_to_assign}
                    task_to_assign_label={sectorConstant.task_to_assign_label}
                    assingned_to_list={sectors}
                    task_to_assign_list={strategicGoals}
                    onSubmit={handleFormSubmit}
                    onClose={() => setShowModal(false)}
                  />
                </Modal>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
              {currentItems.map((sector, index) => (
                <CardList
                  key={index}
                  sectorName={usernames[sector.sector]}
                  performance={sector.performance_percentage}
                  givenDate={sector.given_date}
                  dayLeft={sector.days_left}
                  status={sector.status}
                  onClick={() => handleCardClick(sector)}
                />
              ))}
            </div>
          </CardBody>
          <CardFooter>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardFooter>
        </Card>
      </div>

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        {selectedSector && (
          <FormEditTrack
            data={selectedSector}
            heading={sectorConstant.heading}
            assigned_to={sectorConstant.assigned_to}
            assigned_to_label={sectorConstant.assigned_to_label}
            task_to_assign={sectorConstant.task_to_assign}
            task_to_assign_label={sectorConstant.task_to_assign_label}
            assingned_to_list={sectors}
            task_to_assign_list={strategicGoals}
            onSubmit={handleEditSubmit}
            onDelete={handleDeleteTrack}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </Modal>
    </>
  );
};

export default SectorTracking;
