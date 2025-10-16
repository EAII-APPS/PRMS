import { useForm } from "react-hook-form";
import { statusList } from "../utils/utils";
import Modal from "./Modal";
import CommentCard from "./CommentCard";

const FormAddTrack = ({
  heading,
  assigned_to,
  assigned_to_label,
  task_to_assign,
  task_to_assign_label,
  assingned_to_list,
  task_to_assign_list,
  onSubmit,
  onClose,
}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      status: "ongoing",
      start_date: "",
      end_date: "",
    },
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form
      className="w-[500px] h-[438px]"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
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
        </div>
      </div>
      <div className="flex justify-end  space-x-4 mr-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-red-300  hover:bg-red-300 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline  "
        >
          Close
        </button>
        <button
          type="submit"
          className="bg-blue-500  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline  "
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default FormAddTrack;
