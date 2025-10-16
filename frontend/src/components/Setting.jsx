import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../GlobalContexts/Auth-Context";
import avatarImage from "../assets/EAII.png";
import axiosInistance from "../GlobalContexts/Base_url";

import {
  Card,
  CardHeader,
  Button,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogo } from "../reduxToolKit/slices/settingSlice";

function Setting() {
  const { t } = useTranslation();

  const authInfo = useAuth();

  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const { logo } = useSelector((state) => state.setting);

  useEffect(() => {
    dispatch(fetchLogo());
  }, []);

  const { trree } = useSelector((state) => state.setting);



  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    // Basic validation (replace with your specific requirements)
    if (!selectedFile || !selectedFile.type.match("image/*")) {
      console.error("Invalid file type. Please select an image.");
      return;
    }

    setImage(selectedFile);
  };

  const [image, setImage] = useState("");
  const token = localStorage.getItem("access");

  const handleAddLogo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("logo_image", image);
    try {
      const logoImage = await axiosInistance.post(
        "/tracking/systemsetting/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchLogo());
    } catch (error) {}
  };

  return (
    <div>
      {authInfo ? (
        <>
          <p className="text-base font-bold font-sans">Change Logo </p>
          <Card className="w-full h-screen mt-5 rounded-md">
            <CardHeader
              floated={false}
              shadow={false}
              className="rounded-none"
            ></CardHeader>
            <CardBody className="xl:flex md:grid gap-5">
              <Card className="flex justify-center xl:w-1/2 md:full h-full gap-5 rounded-md">
                <div className="m-10 ">
                  <h1 className="text-black font-bold text-xl">Change Logo</h1>
                  <h1>Change your Logo here</h1>
                </div>
                <div className="grid justify-center items-center">
                  <div className="flex justify-center cursor-pointer">
                    <label className=" text-lg font-bold absolute top-[50%]">Click here to select logo image</label>
                    <div className="flex justify-center opacity-30">
                    <img
                      src={
                        logo 
                      }
                      alt="avatar"
                      className="w-1/2  rounded-full"
                      onClick={handleClick}
                    />
                    </div>
                  </div>

                  <div className="flex gap-5 justify-center items-center m-5">
                    <form onSubmit={handleAddLogo} className="flex gap-5">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                      />
                      <Button
                        variant="text"
                        size="xl"
                        className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                        onClick={handleAddLogo}
                      >
                        {}
                        Upload
                      </Button>
                    </form>
                  </div>
                  <div className="mb-10 ml-5">
                    <h1>Allowed JPG, GIF OR PNG. Max size of 800K</h1>
                  </div>
                </div>
              </Card>
            </CardBody>
            <CardFooter className="flex items-center justify-between p-4"></CardFooter>
          </Card>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default Setting;
