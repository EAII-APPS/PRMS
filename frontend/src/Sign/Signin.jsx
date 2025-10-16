import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import axiosInistance from "../GlobalContexts/Base_url";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import i18next from "i18next";
import { fetchLogo } from "../reduxToolKit/slices/settingSlice";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import avatarImage from "../assets/EAII.png";

function Signin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [view, setView] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [amharic, setAmharic] = useState(true);
  const [english, setEnglish] = useState(false);
  const dispatch = useDispatch();
  const { logo } = useSelector((state) => state.setting);

  useEffect(() => {
    dispatch(fetchLogo());
  }, [dispatch]); // Fetch the logo when the app loads

  const handleAmharic = () => {
    i18next.changeLanguage("am");

    setAmharic(true);

    setEnglish(false);
  };
  const handleEnglish = () => {
    i18next.changeLanguage("en");

    setEnglish(true);

    setAmharic(false);
  };

  const HandleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInistance.post("/userApp/login", {
        username,
        password,
      });

      navigate("/Home/Dashboard");
      window.location.reload();

      const { access, refresh } = response.data;

      localStorage.setItem("access", access);

      localStorage.setItem("refresh", refresh);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="xl:flex md:flex justify-center items-center h-screen bg-blue-gray-50 sm:grid ">

      <div className="absolute top-0 right-1  flex justify-center  text-center mt-5 2xl:ml-5  w-fit">
          <Select
            label={
              (amharic && "ቋንቋ") ||
              (english && "language") ||
              (oromoo && "afaan")
            }
            variant="standard"
            color="blue"
            className="w-2/4"
          >
            <Option onClick={handleAmharic} className="focus:text-light-blue-700">
              አማርኛ
            </Option>
            <Option onClick={handleEnglish} className="focus:text-light-blue-700">
              English
            </Option>
          </Select>
        </div>
      <Card className="h-[75%] sm:w-[100%] md:w-[80%] lg:w-[30%] rounded-md rounded-l-none bg-white shadow-2xl">
        <CardBody className="flex  2xl:scale-90 flex-col gap-5 h-screen -mt-10 justify-center">
        <CardBody className="flex flex-col gap-4 2xl:scale-90 2xl:text-2xl -mb-5 justify-center items-center">
          {logo ?(
            <img src={avatarImage} alt="avatar" className="w-1/3 justify-center items-center" />
          ):(
            <img src={logo} alt="avatar" className="w-1/3 justify-center items-center" />
          )}
          <h1 className="text-black text-2xl font-sans font-bold text-center -mt-2 -mx-5">
            {t("LOGINPAGE.LOGINPAGE")}
          </h1>
        </CardBody>
          <div>
            <h1 className="text-xl text-center text-gray-900 font-bold font-sans ">
              {t("LOGINPAGE.LOGIN")}
            </h1>
            <p className="text-center text-gray-900 font-sans ">{t("LOGINPAGE.SIGNIN")}</p>
          </div>
          <form onSubmit={HandleLogin}>
            <div className="flex flex-col gap-3">
              <Input
                type="text"
                label={t("LOGINPAGE.EMAIL")}
                id="Username"
                size="lg"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                color="black"
              />
              <div className="relative mt-2">
                <Input
                  type={view ? "text" : "password"}
                  id="Password"
                  label={t("LOGINPAGE.PASSWORD")}
                  size="lg"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  color="black"
                />

                {view ? (
                  <div>
                    <FontAwesomeIcon
                      icon={faEye}
                      onClick={() => setView(false)}
                      className="absolute right-2 top-1/4 text-center cursor-pointer"
                    />
                  </div>
                ) : (
                  <div>
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      onClick={() => setView(true)}
                      className="absolute right-2 top-1/4 text-center cursor-pointer"
                    />
                  </div>
                )}
              </div>
              <h1 className="text-purple-900 font-sans font-bold">
                {errorMessage ? "Email or password Invalid" : undefined}
              </h1>

              <Button
                type="submit"
                size="md"
                className=" w-full hover:bg-blue-600 rounded-sm text-white bg-[#0097a7] normal-case z-50"
                onClick={HandleLogin}
              >
                {t("LOGINPAGE.LOGIN")}
              </Button>

              <Typography
                as="a"
                onClick={() => navigate("/ForgetPassword")}
                variant="small"
                className="ml-1 text-gray-900 cursor-pointer text-center font-bold underline decoration-light-blue-700 z-50"
              >
                {t("LOGINPAGE.FORGETPASSWORD")}
              </Typography>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
export default Signin;
