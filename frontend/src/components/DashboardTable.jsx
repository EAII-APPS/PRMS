import React, { useState } from "react";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const DashboardTable = ({ data = [] }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const rows = data.map((item, index) => ({
    id: index + 1,
    ...item
  }));

  const filteredRows = rows.filter((row) =>
    row.kpi?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card className="w-full shadow-lg border border-gray-100 rounded-xl mt-6 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
        <Typography variant="h6" color="blue-gray" className="font-bold">
          {t('MAIN.DASHBOARD_PAGE.CHARTS.KPI_PERFORMANCE') || "KPI Performance Overview"}
        </Typography>

        <div className="relative w-full md:w-72">
          <Input
            label={t('MAIN.DASHBOARD_PAGE.SEARCH_PLACEHOLDER')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            icon={<FontAwesomeIcon icon={faSearch} className="text-gray-400" />}
            className="bg-white"
          />
        </div>
      </div>

      <CardBody className="p-0 overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {[
                t('MAIN.DASHBOARD_PAGE.ID'),
                t('MAIN.DASHBOARD_PAGE.KPI_NAME'),
                t('MAIN.DASHBOARD_PAGE.WEIGHT'),
                t('MAIN.DASHBOARD_PAGE.TOTAL_PLAN'),
                t('MAIN.DASHBOARD_PAGE.Q1'),
                t('MAIN.DASHBOARD_PAGE.Q2'),
                t('MAIN.DASHBOARD_PAGE.Q3'),
                t('MAIN.DASHBOARD_PAGE.Q4'),
                t('MAIN.DASHBOARD_PAGE.TOTAL_PERFORMANCE')
              ].map((head, index) => (
                <th
                  key={head}
                  className={`border-b border-blue-gray-100 bg-gradient-to-r ${index === 0 ? "from-blue-600 to-blue-500" :
                    index === 8 ? "from-blue-500 to-blue-600" : "bg-blue-500"
                    } p-4`}
                >
                  <Typography
                    variant="small"
                    color="white"
                    className="font-bold leading-none opacity-90 uppercase text-[10px] tracking-wider"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentRows.length > 0 ? (
              currentRows.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-bold">
                      {row.id}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-medium max-w-[300px] whitespace-normal">
                      {row.kpi}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {row.weight}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {row.total_plan}
                    </Typography>
                  </td>
                  {[
                    row["q1_performance(%)"],
                    row["q2_performance(%)"],
                    row["q3_performance(%)"],
                    row["q4_performance(%)"]
                  ].map((perf, i) => (
                    <td key={i} className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {perf}%
                        </Typography>
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${parseFloat(perf) >= 90 ? 'bg-green-500' :
                              parseFloat(perf) >= 70 ? 'bg-blue-500' :
                                parseFloat(perf) >= 50 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${Math.min(100, parseFloat(perf))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  ))}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${parseFloat(row["total_performance(%)"]) >= 90 ? 'bg-green-500' :
                          parseFloat(row["total_performance(%)"]) >= 70 ? 'bg-blue-500' :
                            parseFloat(row["total_performance(%)"]) >= 50 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                      />
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        {row["total_performance(%)"]}%
                      </Typography>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-8 text-center">
                  <Typography variant="small" color="blue-gray" className="opacity-50 italic">
                    No results found matching your search.
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page <strong className="text-blue-gray-900">{currentPage}</strong> of{" "}
          <strong className="text-blue-gray-900">{totalPages || 1}</strong>
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="normal-case"
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="normal-case"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DashboardTable;