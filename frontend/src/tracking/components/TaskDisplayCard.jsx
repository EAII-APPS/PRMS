import { Card, CardBody, CardFooter } from "@material-tailwind/react";
import CardList from "./CardList";
import { ITEMS_PER_PAGE } from "../utils/utils";
import { useState } from "react";
import Pagination from "./Pagination";
import Modal from "./Modal";
import CommentCard from "./CommentCard";

const TaskDisplayCard = ({ onClose, data = [], usernames }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrackId, setSelectedTrackId] = useState(null);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (trackId) => {
    setSelectedTrackId(trackId);
    setShowModal(true);
  };

  return (
    <div>
      <div className="grid gap-3 items-center">
        <h1 className="whitespace-nowrap text-left text-xl font-bold text-black">
          Assigned Task List
        </h1>

        <Card className="rounded-md">
          <CardBody className="flex flex-col space-y-8">
            {data.length === 0 ? (
              <div className="text-center text-gray-500">No tasks assigned</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {currentItems.map((track, index) => (
                  <CardList
                    key={index}
                    sectorName={
                      usernames[track.kpi] ||
                      track.kpi ||
                      usernames[track.main_goal] ||
                      track.main_goal ||
                      usernames[track.strategic_goal] ||
                      track.strategic_goal
                    }
                    performance={track.performance_percentage}
                    givenDate={track.given_date}
                    dayLeft={track.days_left}
                    onClick={() => handleCardClick(track.id)}
                  />
                ))}

                <Modal show={showModal} onClose={() => setShowModal(false)}>
                  <CommentCard trackId={selectedTrackId} />
                </Modal>
              </div>
            )}
          </CardBody>
          {data.length > 0 && (
            <CardFooter>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TaskDisplayCard;
