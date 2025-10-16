import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../GlobalContexts/Auth-Context";
import axiosInistance from "../GlobalContexts/Base_url";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Card, Button, Input } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Setting() {
  const { t } = useTranslation();

  const authInfo = useAuth();

  const navigate = useNavigate();

  const [viewOld, setViewOld] = useState(false);
  const [viewNew, setViewNew] = useState(false);

  const [viewConfirm, setViewConfirm] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const token = localStorage.getItem("access");

  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorEmptyMessage, setErrorEmptyMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("old_password", oldPassword);
    formData.append("new_password", newPassword);

    if (!oldPassword) {
      setErrorEmptyMessage("Please enter your Old Password");
      return;
    }
    if (!newPassword) {
      setErrorEmptyMessage("Please enter new Password");
      return;
    }
    if (!confirmPassword) {
      setErrorEmptyMessage("Please confirm your new Password");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setErrorEmptyMessage(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (!newPassword === confirmPassword) {
      setErrorEmptyMessage("Password Doesn't match");
      return;
    }

    try {
      const logoImage = await axiosInistance.post(
        "/userApp/change_password",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOldPassword("");

      setNewPassword("");

      setConfirmPassword("");

      // toast.success("Password Changed successfully ", {
      //   autoClose: 2000,
      //   hideProgressBar: true,
      // });

      navigate("/");

      localStorage.removeItem("refresh");

      localStorage.removeItem("access");
    } catch (error) {
      setErrorEmptyMessage("Something went wrong try again");
    }
  };

  return (
    <div>
      {authInfo ? (
        <>
          <div className="grid gap-3 items-center">
            <p className="text-base font-bold font-sans">
              {t("MAIN.PROFILE.CHANGE_PASSWORD")}
            </p>
            <ToastContainer />

            <Card className="flex justify-center w-full h-full gap-5 rounded-md overflow-auto">
              <form
                onSubmit={handleChangePassword}
                className="grid gap-5 items-center w-1/3 m-10  mx-auto"
              >
                <div className="w-full relative justify-self-center">
                  <Input
                    type={viewOld ? "text" : "password"}
                    id="email"
                    label={t("MAIN.INPUTFIELD.OLD_PASSWORD")}
                    size="lg"
                    color="blue"
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value), setErrorEmptyMessage("");
                    }}
                  />

                  {viewOld ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faEye}
                        onClick={() => setViewOld(false)}
                        className="absolute right-3 top-1/4 hover:text-light-blue-700 text-center cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div>
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        onClick={() => setViewOld(true)}
                        className="absolute right-3 top-1/4 hover:text-light-blue-700  text-center cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <div className="w-full relative justify-self-center">
                  <Input
                    type={viewNew ? "text" : "password"}
                    id="email"
                    label={t("MAIN.INPUTFIELD.NEW_PASSWORD")}
                    size="lg"
                    color="blue"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value), setErrorEmptyMessage("");
                    }}
                  />
                  {viewNew ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faEye}
                        onClick={() => setViewNew(false)}
                        className="absolute right-3 top-1/4 hover:text-light-blue-700 text-center cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div>
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        onClick={() => setViewNew(true)}
                        className="absolute right-3 top-1/4 hover:text-light-blue-700  text-center cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <div className="w-full relative justify-self-center">
                  <Input
                    type={viewConfirm ? "text" : "password"}
                    color="blue"
                    id="email"
                    label={t("MAIN.INPUTFIELD.CONFIRM_PASSWORD")}
                    size="lg"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value),
                        setErrorEmptyMessage("");
                    }}
                  />
                  {viewConfirm ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faEye}
                        onClick={() => setViewConfirm(false)}
                        className="absolute right-3 top-1/4 hover:text-light-blue-700 text-center cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div>
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        onClick={() => setViewConfirm(true)}
                        className="absolute right-3 top-1/4 hover:text-light-blue-700  text-center cursor-pointer"
                      />
                    </div>
                  )}
                  <p className="text-red-900 text-sm">{errorEmptyMessage}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="text"
                    type="submit"
                    size="xl"
                    className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case w-1/3 text-center"
                    onClick={handleChangePassword}
                  >
                    {t("MAIN.PROFILE.CHANGE_PASSWORD")}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default Setting;
