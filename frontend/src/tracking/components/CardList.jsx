import { FaRegStar } from "react-icons/fa";

const CardList = ({
  sectorName,
  performance,
  onClick,
  givenDate,
  dayLeft,
  status,
}) => {
  let starCount;
  let buttonBgColor;

  if (performance <= 50) {
    starCount = 2;
    buttonBgColor = "bg-red-500";
  } else if (performance <= 65) {
    starCount = 3;
    buttonBgColor = "bg-orange-500";
  } else if (performance <= 95) {
    starCount = 4;
    buttonBgColor = "bg-green-500";
  } else {
    starCount = 5;
    buttonBgColor = "bg-green-500 ";
  }

  const stars = Array.from({ length: starCount }, (_, index) => (
    <FaRegStar
      key={index}
      className={`${
        performance > 50 ? "text-green-500" : "text-red-500"
      } text-3xl flex space-x-2`}
    />
  ));

  return (
    <div
      className="w-[320px] h-[215px] bg-white shadow-md rounded-2xl p-4 shadow-gray-400 space-y-4 "
      onClick={onClick}
    >
      <h2 className="text-xl font-bold mb-2 h-[23.81px]">{sectorName}</h2>
      <div className="flex space-x-2">{stars}</div>

      {status === "compeleted" ? (
        <div className="flex space-x-14 ">
          <p className="w-full h-[37px] bg-[#22dd09] items-center flex justify-center">
            Given task is Compeleted!
          </p>
        </div>
      ) : (
        <div className="flex space-x-14 ">
          <div className="flex flex-col ">
            <label htmlFor="sector" className="w-[103px] h-[21px]">
              Given Date:
            </label>
            <p className="w-[94.4px] h-[37px] bg-[#F9F1F1] items-center flex justify-center">
              {givenDate}
            </p>
          </div>
          <div className="flex flex-col ">
            <label htmlFor="sector" className="w-[103px] h-[21px]">
              {dayLeft > 0 ? " Days Left:" : "Days passed:"}
            </label>
            <p
              className={`w-[94.4px] h-[37px] ${
                dayLeft > 0 ? "bg-[#F9F1F1]" : "bg-red-500"
              } items-center flex justify-center`}
            >
              {Math.abs(dayLeft)}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end mr-4">
        <button
          className={`${buttonBgColor} text-white px-4 py-2 rounded-3xl w-[120px] h-[30px]`}
        >
          {`${performance > 50 ? "+" : "-"} ${performance} `}%
        </button>
      </div>
    </div>
  );
};

export default CardList;
