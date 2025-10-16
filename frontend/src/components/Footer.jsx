import React from "react";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="">
      <footer className="flex w-full flex-row items-center justify-between border-t border-blue-gray-200 text-center  h-10">
        <Typography color="blue-gray" className="font-normal ml-5">
          {t("MAIN.FOOTER.DATE", { year: currentYear })}
        </Typography>
        <Typography color="blue-gray" className="font-normal mr-5">
          {t("MAIN.FOOTER.COPYRIGHT")}
        </Typography>
      </footer>
    </div>
  );
}
export default Footer;
