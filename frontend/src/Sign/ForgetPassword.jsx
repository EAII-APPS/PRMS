import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
} from "@material-tailwind/react";

function ForgetPassword() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen bg-blue-gray-50">
      <Card className="xl:w-1/4 xl:h-3/4 md:w-1/3 md:h-4/5 rounded-md sm:w-full sm:h-full ">
        <button onClick={() => navigate("/")}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a10d6885e0480824dc75cf2a2dbaf6d5cdbd38571ca351afeda7c8ec977bfa7?apiKey=3061b615d14b47beba1c5888fe8aa383&"
            alt="Back arrow icon"
            className="shrink-0 my-auto w-5 aspect-square ml-7 mt-7 "
          />
        </button>
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none flex xl:mt-24 md:mt-24 sm:mt-0 justify-center"
        >
          <h1 className="text-xl text-center text-black font-bold font-sans">
            Enter Your Email Here
          </h1>
        </CardHeader>
        <CardBody className="flex flex-col gap-7 mb-0">
          <Input
            type="email"
            label="Email"
            autocomplete="off"
            size="lg"
            autofill="off"
          />

          <Button
            variant="text"
            size="sm"
            className="hover:bg-blue-700 text-white bg-blue-700 normal-case"
          >
            Submit
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
export default ForgetPassword;
