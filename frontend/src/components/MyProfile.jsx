import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../GlobalContexts/Auth-Context";
import axiosInstance from "../GlobalContexts/Base_url";

import {
  Card,
  Input,
  Button,
  CardBody,
  Select,
  Option,
} from "@material-tailwind/react";

import { useTranslation } from "react-i18next";

function MyProfile() {
  const { t } = useTranslation();

  const token = localStorage.getItem("access");

  const authInfo = useAuth();

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const [email, setEmail] = useState("");
  const [id,setId]=useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState("");

  const [role, setRole] = useState("");

  if (authInfo) {
    useEffect(() => {
      setId(authInfo.user.id);
      setFirstName(authInfo.user.first_name);
      setEmail(authInfo.user.email);
      setLastName(authInfo.user.last_name);
      setPhone(authInfo.user.phone);
      setGender(authInfo.user.gender);
      setRole(authInfo.user.userRole);
    }, []);
  }

  const handleProfileUPdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("gender", gender);
    formData.append("phone", phone);
    formData.append("image", image);
    
    try {
      await axiosInstance.put(`userApp/users/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {}
  };

  return (
    <div className="grid gap-3 items-center">
      {authInfo ? (
        <>
          <div>
            <p className="text-base font-bold font-sans">Account Setting </p>
            <Card className="w-full h-full mt-5 rounded-md">
              <CardBody className="xl:flex md:grid gap-5">
                <Card className="flex justify-center xl:w-1/2 md:w-full h-full gap-5 rounded-md">
                  <div className="m-10 ">
                    <h1 className="text-black font-bold text-xl">
                      Change Pofile
                    </h1>
                    <h1>Change your profile from here</h1>
                  </div>
                  <div className="grid justify-center items-center">
                    <div className="flex justify-center">
                      {authInfo.user.photo ? (
                        <img
                          variant="circular"
                          size="sm"
                          alt="Pp"
                          className="w-1/3 mr-10"
                          src={authInfo.user.image}
                        />
                      ) : (
                        <FontAwesomeIcon
                          className="w-1/3 h-1/3 mr-10"
                          icon={faUser}
                        />
                      )}
                    </div>

                    <div className="flex gap-5 justify-center items-center m-5">
                      <Button
                        variant="text"
                        size="md"
                        className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                        onClick={handleClick}
                      >
                        Upload
                      </Button>
                      <Button
                        variant="text"
                        color="red"
                        className="normal-case border border-red-700"
                        size="md"
                      >
                        Reset
                      </Button>
                    </div>
                    <div className="mb-10 ml-5">
                      <h1 className="">
                        Allowed JPG, GIF OR PNG. Max size of 800K
                      </h1>
                    </div>
                  </div>
                </Card>
                <Card className="flex justify-center xl:w-1/2 md:full h-full gap-5 rounded-md">
                  <div className="m-5">
                    <h1 className="text-black font-bold text-xl">
                      Personal Deatils
                    </h1>
                    <h1>
                      To change your personal Deatils, edit and save from here
                    </h1>
                  </div>
                  <form
                    onSubmit={handleProfileUPdate}
                    className="grid gap-5 items-center w-11/12 mb-10  mx-auto"
                  >
                    <div className="w-full justify-self-center">
                      <input
                        ref={fileInputRef}
                        className="hidden"
                        type="file"
                        accept="image/*"
                        value={FormData.image}
                        onChange={(e) => {
                          setImage(e.target.files[0]);
                        }}
                      />
                      <Input
                        type="text"
                        id="firstName"
                        color="blue"
                        label={t("MAIN.INPUTFIELD.FIRSTNAME")}
                        size="lg"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="w-full justify-self-center">
                      <Input
                        type="text"
                        id="lastName"
                        label="Last Name"
                        size="lg"
                        color="blue"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="w-full justify-self-center">
                      <Input
                        type="email"
                        id="email"
                        label="Email"
                        size="lg"
                        color="blue"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="w-full justify-self-center">
                      <label size="lg" className="ml-2">
                        Role
                      </label>
                      <Input
                        type="text"
                        id="role"
                        label="Role"
                        color="blue"
                        size="lg"
                        value={role}
                        disabled
                      />
                    </div>

                    <div className="w-full justify-self-center">
                      <Input
                        type="text"
                        id="phone"
                        color="blue"
                        label="Phone"
                        size="lg"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="w-full justify-self-center">
                      <Select
                        label="Gender"
                        color="blue"
                        value={gender}
                        onChange={(e) => setGender(e)}
                      >
                        <Option
                          value="Male"
                          className="focus:text-light-blue-700"
                        >
                          Male
                        </Option>
                        <Option
                          value="Female"
                          className="focus:text-light-blue-700"
                        >
                          Female
                        </Option>
                      </Select>
                    </div>

                    <div className="space-x-2 flex justify-self-end">
                      <Button
                        variant="text"
                        type="submit"
                        size="md"
                        className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                        onClick={handleProfileUPdate}
                      >
                        Save
                      </Button>
                      <Button
                        variant="text"
                        color="red"
                        className="normal-case"
                        size="md"
                      >
                        <span>Cancel</span>
                      </Button>
                    </div>
                  </form>
                </Card>
              </CardBody>
            </Card>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default MyProfile;
