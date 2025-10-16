/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Card, CardBody, CardFooter } from "@material-tailwind/react";
import { IoAdd } from "react-icons/io5";
import FormAddTrack from "./components/FormAddTrack";
import FormEditTrack from "./components/FormEditTrack";
import Modal from "./components/Modal";
import { useEffect, useState } from "react";
import CardList from "./components/CardList";
import useApi from "./hook/UseAuth";
import { divisionConstant, ITEMS_PER_PAGE } from "./utils/utils";
import Pagination from "./components/Pagination";
import { AiFillEye } from "react-icons/ai";
import TaskDisplayCard from "./components/TaskDisplayCard";

const DivisionTracking = () => {
  const { get, post, del, put } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskDisplayModal, setShowTaskDisplayModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [mainGoals, setMainGoals] = useState([]);
  const [assignedTask, setAssignedTask] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [sterategicGoalNames, setSterategicGoalNames] = useState({});

  const fetchDivisions = async () => {
    try {
      const divisionData = await get("userApp/division/");
      setDivisions(divisionData);
    } catch (error) {
      setError(error);
    }
  };

  const fetchUsernameById = (id) => {
    return get(`userApp/division/${id}`)
      .then((userData) => userData.name)
      .catch((error) => {
        console.error(error);
        return null;
      });
  };

  const fetchSterategicGoalNameById = (id) => {
    return get(`planApp/strategicGoals/${id}/`)
      .then((userData) => userData.name)
      .catch((error) => {
        console.error(error);
        return null;
      });
  };

  const fetchAssignedTask = async () => {
    try {
      const assignedTaskData = await get("tracking/tasks/sector/");
      setAssignedTask(assignedTaskData);
    } catch (error) {
      setError(error);
    }
  };

  const fetchMainGoals = async () => {
    try {
      const mainGoalsData = await get("planApp/mainGoals/");
      setMainGoals(mainGoalsData);
    } catch (error) {
      setError(error);
    }
  };

  const fetchtrackes = async () => {
    try {
      const trackData = await get("tracking/trackDivision/");
      setTracks(trackData);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchDivisions();
      await fetchMainGoals();
      await fetchtrackes();
      await fetchAssignedTask();
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(tracks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // const filteredDivisions = tracks.filter((division) =>
  //   division.division.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const currentItems = tracks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCardClick = async (division) => {
    try {
      const trackDetails = await get(`tracking/trackDivision/${division.id}`);
      setSelectedDivision(trackDetails);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching track details:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      const newUsernames = {};
      for (const division of currentItems) {
        if (!usernames[division.division]) {
          const name = await fetchUsernameById(division.division);
          newUsernames[division.division] = name || division.division;
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

  useEffect(() => {
    const fetchSterategicGoalnames = async () => {
      const newSterategicGoalnames = {};
      for (const sector of assignedTask) {
        if (!sterategicGoalNames[sector.strategic_goal]) {
          const name = await fetchSterategicGoalNameById(sector.strategic_goal);
          newSterategicGoalnames[sector.strategic_goal] =
            name || sector.strategic_goal;
        }
      }
      if (Object.keys(newSterategicGoalnames).length > 0) {
        setSterategicGoalNames((prevSterategicGoalnames) => ({
          ...prevSterategicGoalnames,
          ...newSterategicGoalnames,
        }));
      }
    };

    fetchSterategicGoalnames();
  }, [assignedTask]);

  const handleFormSubmit = (data) => {
    if (new Date(data.start_date) > new Date(data.end_date)) {
      alert("Start date cannot be greater than end date.");
      return;
    }
    post("tracking/trackDivision/", data)
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
    put(`tracking/trackDivision/${data.id}/`, data)
      .then((response) => {
        setShowEditModal(false);
        fetchtrackes();
      })
      .catch((error) => {
        console.error("Error updating data:", error.response.data);
      });
  };

  const handleDeleteTrack = (trackId) => {
    del(`tracking/trackDivision/${trackId}`)
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
              <div className="flex space-x-2">
                {/* <div>
                  <button
                    onClick={() => setShowTaskDisplayModal(true)}
                    className="bg-[#3B82F6] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex space-x-2 items-center"
                  >
                    <AiFillEye /> <p>assigned task</p>
                  </button>
                  <Modal
                    show={showTaskDisplayModal}
                    data={assignedTask}
                    onClose={() => setShowTaskDisplayModal(false)}
                  >
                    <TaskDisplayCard
                      data={assignedTask}
                      usernames={sterategicGoalNames}
                      onClose={() => setShowTaskDisplayModal(false)}
                    />
                  </Modal>
                </div> */}

                <div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#3B82F6] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex space-x-2"
                  >
                    <IoAdd /> <p>Add Tracking</p>
                  </button>

                  <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <FormAddTrack
                      heading={divisionConstant.heading}
                      assigned_to={divisionConstant.assigned_to}
                      assigned_to_label={divisionConstant.assigned_to_label}
                      task_to_assign={divisionConstant.task_to_assign}
                      task_to_assign_label={
                        divisionConstant.task_to_assign_label
                      }
                      assingned_to_list={divisions}
                      task_to_assign_list={mainGoals}
                      onSubmit={handleFormSubmit}
                      onClose={() => setShowModal(false)}
                    />
                  </Modal>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {currentItems.map((division, index) => (
                <CardList
                  key={index}
                  sectorName={usernames[division.division]}
                  performance={division.performance_percentage}
                  givenDate={division.given_date}
                  dayLeft={division.days_left}
                  status={division.status}
                  onClick={() => handleCardClick(division)}
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
        {selectedDivision && (
          <FormEditTrack
            data={selectedDivision}
            heading={divisionConstant.heading}
            assigned_to={divisionConstant.assigned_to}
            assigned_to_label={divisionConstant.assigned_to_label}
            task_to_assign={divisionConstant.task_to_assign}
            task_to_assign_label={divisionConstant.task_to_assign_label}
            assingned_to_list={divisions}
            task_to_assign_list={mainGoals}
            onSubmit={handleEditSubmit}
            onDelete={handleDeleteTrack}
            onClose={() => setShowModal(false)}
          />
        )}
      </Modal>
    </>
  );
};

export default DivisionTracking;
