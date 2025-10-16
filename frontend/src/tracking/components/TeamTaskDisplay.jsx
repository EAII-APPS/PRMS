import { Card, CardBody, CardFooter } from "@material-tailwind/react";
import useApi from "../hook/UseAuth";
import CardList from "../components/CardList";
import { ITEMS_PER_PAGE } from "../utils/utils";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Modal from "./Modal";
import CommentCard from "./CommentCard";

const TeamTaskDisplay = () => {
  const { get } = useApi();
  const [assignedTask, setAssignedTask] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpisNames, setKpisNames] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);

  const handleCardClick = (trackId) => {
    setSelectedTrackId(trackId);
    setShowModal(true);
  };
  const fetchAssignedTask = async () => {
    try {
      const assignedTaskData = await get("tracking/tasks/team/");
      setAssignedTask(assignedTaskData);
    } catch (error) {
      setError(error);
      console.error("Error fetching assigned tasks:", error);
    }
  };

  const fetchKpisById = async (id) => {
    try {
      const userData = await get(`planApp/getKPI/${id}`);
      if (Array.isArray(userData) && userData.length > 0) {
        const name = userData[0].name;
        return name;
      } else {
        console.warn(`No name found for KPI ID ${id}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching KPI for ID ${id}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAssignedTask();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchKpiNames = async () => {
      const newKpiNames = {};
      for (const team of assignedTask) {
        if (!kpisNames[team.kpi]) {
          const name = await fetchKpisById(team.kpi);
          if (name) {
            newKpiNames[team.kpi] = name;
          } else {
          }
        }
      }
      if (Object.keys(newKpiNames).length > 0) {
        setKpisNames((prevKpiNames) => ({
          ...prevKpiNames,
          ...newKpiNames,
        }));
      }
    };

    if (assignedTask.length > 0) {
      fetchKpiNames();
    }
  }, [assignedTask]);

  const totalPages = Math.ceil(assignedTask.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = assignedTask.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="grid gap-3 items-center">
        <h1 className="whitespace-nowrap text-left text-xl font-bold text-black">
          assigned task
        </h1>
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {currentItems.map((team, index) => (
                <CardList
                  key={index}
                  sectorName={kpisNames[team.kpi] || "Loading..."}
                  performance={team.performance_percentage}
                  givenDate={team.given_date}
                  dayLeft={team.days_left}
                  status={team.status}
                  onClick={() => handleCardClick(team.id)}
                />
              ))}

              <Modal show={showModal} onClose={() => setShowModal(false)}>
                <CommentCard trackId={selectedTrackId} />
              </Modal>
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
    </>
  );
};

export default TeamTaskDisplay;
