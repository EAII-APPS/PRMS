/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@material-tailwind/react";
import { IoAdd } from "react-icons/io5";
import FormAddTrack from "./components/FormAddTrack";
import FormEditTrack from "./components/FormEditTrack";
import Modal from "./components/Modal";
import { AiFillEye } from "react-icons/ai";
import useApi from "./hook/UseAuth";
import { useAuth } from "../GlobalContexts/Auth-Context";
import CardList from "./components/CardList";
import { teamConstant, ITEMS_PER_PAGE } from "./utils/utils";
import Pagination from "./components/Pagination";
import TaskDisplayCard from "./components/TaskDisplayCard";
import TeamTaskDisplay from "./components/TeamTaskDisplay";

const TeamTracking = () => {
  const { get, post, put, del } = useApi();
  const authInfo = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskDisplayModal, setShowTaskDisplayModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [assignedTask, setAssignedTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [mainGoalNames, setMainGoalNames] = useState({});

  const fetchTeams = async () => {
    try {
      const teamsData = await get("userApp/users/");
      setTeams(teamsData);
    } catch (error) {
      setError(error);
    }
  };

  const fetchAssignedTask = async () => {
    try {
      const assignedTaskData = await get("tracking/tasks/division/");
      setAssignedTask(assignedTaskData);
    } catch (error) {
      setError(error);
    }
  };

  const fetchKpis = async () => {
    try {
      const kpisData = await get("planApp/getKPI/");
      setKpis(kpisData);
    } catch (error) {
      setError(error);
    }
  };

  const fetchUsernameById = (id) => {
    return get(`userApp/users/${id}`)
      .then((userData) => userData.first_name)
      .catch((error) => {
        console.error(error);
        return null;
      });
  };

  // const fetchMainGoalNameById = (id) => {
  //   return get(`planApp/maingoal/${id}`)
  //     .then((userData) => userData.name)
  //     .catch((error) => {
  //       console.error(error);
  //       return null;
  //     });
  // };

  const fetchMainGoalNameById = async (id) => {
    try {
      const userData = await get(`planApp/maingoal/${id}`);
      if (Array.isArray(userData) && userData.length > 0) {
        const name = userData[0].name;
        return name;
      } else {
        console.warn(`No name found for main goal ID ${id}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching main goal for ID ${id}:`, error);
      return null;
    }
  };

  const fetchtrackes = async () => {
    try {
      const trackData = await get("tracking/trackTeam/");
      setTracks(trackData);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchTeams();
      await fetchKpis();
      await fetchtrackes();
      await fetchAssignedTask();
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(tracks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // const filteredTeams = tracks.filter((team) =>
  //   team.username.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const currentItems = tracks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCardClick = async (team) => {
    try {
      const trackDetails = await get(`tracking/trackTeam/${team.id}`);
      setSelectedTeam(trackDetails);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching track details:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      const newUsernames = {};
      for (const team of currentItems) {
        if (!usernames[team.team]) {
          const username = await fetchUsernameById(team.team);
          newUsernames[team.team] = username || team.team;
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
    const fetchMainGoalNames = async () => {
      const newMainGoalNames = {};
      for (const team of assignedTask) {
        if (!mainGoalNames[team.main_goal]) {
          const name = await fetchMainGoalNameById(team.main_goal);
          if (name) {
            newMainGoalNames[team.main_goal] = name || team.main_goal;
          } else {
          }
        }
      }
      if (Object.keys(newMainGoalNames).length > 0) {
        setMainGoalNames((prevUsernames) => ({
          ...prevUsernames,
          ...newMainGoalNames,
        }));
      }
    };

    fetchMainGoalNames();
  }, [assignedTask]);
  const handleFormSubmit = (data) => {
    if (new Date(data.start_date) > new Date(data.end_date)) {
      alert("Start date cannot be greater than end date.");
      return;
    }
    post("tracking/trackTeam/", data)
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
    put(`tracking/trackTeam/${data.id}/`, data)
      .then((response) => {
        setShowEditModal(false);
        fetchtrackes();
      })
      .catch((error) => {
        console.error("Error updating data:", error.response.data);
      });
  };

  const handleDeleteTrack = (trackId) => {
    del(`tracking/trackTeam/${trackId}`)
      .then((response) => {
        fetchtrackes();
      })
      .catch((error) => {
        console.error("Error deleting track:", error.response.data);
      });
  };

  return (
    <div>
      {authInfo.user.userPermissions.includes("createKpiTrack") &&
      !authInfo.user.userPermissions.includes("readAssign") ? (
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
                    <div>
                      <button
                        onClick={() => setShowTaskDisplayModal(true)}
                        className="bg-[#3B82F6] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex space-x-2 items-center"
                      >
                        <AiFillEye /> <p>assigned task</p>
                      </button>
                      <Modal
                        show={showTaskDisplayModal}
                        onClose={() => setShowTaskDisplayModal(false)}
                      >
                        <TaskDisplayCard
                          onClose={() => setShowTaskDisplayModal(false)}
                          data={assignedTask}
                          usernames={mainGoalNames}
                        />
                      </Modal>
                    </div>

                    <div>
                      <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#3B82F6] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex space-x-2 items-center"
                      >
                        <IoAdd /> <p>Add Tracking</p>
                      </button>

                      <Modal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <FormAddTrack
                          heading={teamConstant.heading}
                          assigned_to={teamConstant.assigned_to}
                          assigned_to_label={teamConstant.assigned_to_label}
                          task_to_assign={teamConstant.task_to_assign}
                          task_to_assign_label={
                            teamConstant.task_to_assign_label
                          }
                          assingned_to_list={teams}
                          task_to_assign_list={kpis}
                          onSubmit={handleFormSubmit}
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {currentItems.map((team, index) => (
                    <CardList
                      key={index}
                      sectorName={usernames[team.team]}
                      performance={team.performance_percentage}
                      givenDate={team.given_date}
                      dayLeft={team.days_left}
                      status={team.status}
                      onClick={() => handleCardClick(team)}
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
            {selectedTeam && (
              <FormEditTrack
                data={selectedTeam}
                heading={teamConstant.heading}
                assigned_to={teamConstant.assigned_to}
                assigned_to_label={teamConstant.assigned_to_label}
                task_to_assign={teamConstant.task_to_assign}
                task_to_assign_label={teamConstant.task_to_assign_label}
                assingned_to_list={teams}
                task_to_assign_list={kpis}
                onSubmit={handleEditSubmit}
                onDelete={handleDeleteTrack}
                onClose={() => setShowEditModal(false)}
              />
            )}
          </Modal>
        </>
      ) : (
        <>
          <TeamTaskDisplay />
        </>
      )}
    </div>
  );
};

export default TeamTracking;
