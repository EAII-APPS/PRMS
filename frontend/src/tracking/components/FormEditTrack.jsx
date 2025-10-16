import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { MdOutlineInsertComment } from "react-icons/md";
import { useForm } from "react-hook-form";
import { statusList } from "../utils/utils";
import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import Modal from "./Modal";
import CommentCard from "./CommentCard";

const FormEditTrack = ({
  heading,
  assigned_to,
  assigned_to_label,
  task_to_assign,
  task_to_assign_label,
  assingned_to_list,
  task_to_assign_list,
  onSubmit,
  onDelete,
  data,
  onClose,
}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      ...data,
      status: data.status || "ongoing",
      start_date: data.start_date || "",
      end_date: data.end_date || "",
    },
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const handleDelete = () => {
    onDelete(data.id);
    onClose();
    setOpen(false);
  };

  const handleCardClick = (trackId) => {
    setSelectedTrackId(trackId);
    setShowModal(true);
  };

  return (
    <>
      <form className="w-[500px] h-[438px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <h1 className=" text-gray-700 text-3xl font-bold mb-2">{heading}</h1>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor={assigned_to}>{assigned_to_label}</label>
              <select
                {...register(assigned_to, { required: true })}
                className="w-[403.4px] h-[37px] bg-[#F9F1F1]"
              >
                {assingned_to_list.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name || option.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor={task_to_assign}>{task_to_assign_label}</label>
              <select
                {...register(task_to_assign, { required: true })}
                className="w-[403.4px] h-[37px] bg-[#F9F1F1]"
              >
                {task_to_assign_list.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="status">Status:</label>
              <select
                {...register("status", { required: true })}
                className="w-[403.4px] h-[37px] bg-[#F9F1F1]"
              >
                {statusList.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-14">
              <div className="flex flex-col ">
                <label htmlFor="start_date" className="w-[103px] h-[21px]">
                  Start Date:
                </label>
                <input
                  id="start_date"
                  type="date"
                  {...register("start_date")}
                  className="w-[175.4px] h-[37px] bg-[#F9F1F1]"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="end_date" className="w-[103px] h-[21px]">
                  End Date:
                </label>
                <input
                  id="end_date"
                  type="date"
                  {...register("end_date")}
                  className="w-[175.4px] h-[37px] bg-[#F9F1F1]"
                />
              </div>
            </div>

            <div className="flex space-x-14 ">
              <div className="flex flex-col ">
                <label htmlFor="sector" className="w-[103px] h-[21px]">
                  Given Date:
                </label>
                <p className="w-[94.4px] h-[37px] bg-[#F9F1F1] items-center flex justify-center">
                  {data.given_date}
                </p>
              </div>
              <div className="flex flex-col ">
                <label htmlFor="sector" className="w-[103px] h-[21px]">
                  {data.days_left > 0 ? " Days Left:" : "Days passed:"}
                </label>
                <p
                  className={`w-[94.4px] h-[37px] ${
                    data.days_left > 0 ? "bg-[#F9F1F1]" : "bg-red-500"
                  } items-center flex justify-center`}
                >
                  {Math.abs(data.days_left)}
                </p>
              </div>
              <div className="flex flex-col ">
                <label htmlFor="sector" className="w-[103px] h-[21px]">
                  Performance:
                </label>
                <p className="w-[94.4px] h-[37px] bg-[#3BF69C] items-center flex justify-center">
                  {data.performance_percentage}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end  space-x-4 mr-6">
          <button
            type="submit"
            className="bg-[#3B82F6]  hover:bg-[#3B82F6] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline  w-[53px] h-[26px] "
          >
            <CiEdit className="w-[16px] h-[16px]" />
          </button>

          <Button
            onClick={handleOpen}
            className="bg-[#EF4444]  hover:bg-[#EF4444] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline  w-[53px] h-[26px] "
          >
            <MdDelete className="w-[14.38px] h-[16.82px]" />
          </Button>
        </div>
      </form>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleCardClick(data.id);
        }}
        className="bg-[#3BF69C]  hover:bg-[#3BF69C] text-white font-bold py-1 px-4 rounded-md focus:outline-none focus:shadow-outline  w-[53px] h-[26px] "
      >
        <MdOutlineInsertComment className="w-[24px] h-24[px]" />
      </button>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <CommentCard trackId={selectedTrackId} />
      </Modal>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>Are you sure you want to delete this track?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            type="submit"
            variant="gradient"
            color="green"
            onClick={handleDelete}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default FormEditTrack;
