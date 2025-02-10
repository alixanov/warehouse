// import React, { useState } from 'react';
// import { useGetSoldProductsQuery } from '../../context/services/product.service';
// import Table from '../../components/table/table';
// import moment from 'moment-timezone';
// import { useGetParametersQuery } from '../../context/services/parameters.service';
// import { Button, Pagination } from 'antd';
// import { IoMdDownload } from 'react-icons/io';
// import * as XLSX from 'xlsx';

// const Report = () => {
//     const { data = [] } = useGetSoldProductsQuery();
//     const { data: params = [] } = useGetParametersQuery();

//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 20;

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const currentData = data.slice(startIndex, startIndex + itemsPerPage);

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };
//     const columnMapping = {
//         brigada: "Бригада",
//         order: "Hoмep заказа",
//         order_date: "Дата заказа",
//         partiya: "Номер партии",
//         section: "Подразделение",
//         document: "Номер документа",
//         responsible: "Ответственный",
//         created_date: "Дата продажи",
//         quantity: "Вес(кг)",
//         density: "Плотность",
//     };
//     function mapIdsToNames() {
//         return data.map(item => {
//             const mappedItem = {};
//             for (const key in item) {
//                 if (params[key]) {
//                     const resource = params[key].find(r => r._id === item[key]);
//                     const columnName = columnMapping[key] || key;
//                     mappedItem[columnName] = resource ? resource.name || resource.number : item[key];
//                 } else if (key !== "_id" && key !== "__v") {
//                     const columnName = columnMapping[key] || key;
//                     mappedItem[columnName] = item[key];
//                 }
//             }
//             return mappedItem;
//         });
//     }

// function exportExcel() {
//     const worksheet = XLSX.utils.json_to_sheet(mapIdsToNames());
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Продажи");

//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `продажи${moment().tz("Asia/Tashkent").format("DDMMYYYY")}.xlsx`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// }
//     return (
//         <div className='page'>
//             <div className="page_header">
//                 <h1>Продажи</h1>
//                 <div className="header_actions">
//                     <Button onClick={exportExcel} type="primary" style={{ background: "#26944a" }}>
//                         <IoMdDownload />
//                         Скачать Excel
//                     </Button>
//                 </div>
//             </div>
//             <Table>
//                 <thead>
//                     <tr>
//                         <td>Бригада</td>
//                         <td>Hoмep заказа</td>
//                         <td>Дата заказа</td>
//                         <td>Номер партии</td>
//                         <td>Подразделение</td>
//                         <td>Номер документа</td>
//                         <td>Ответственный</td>
//                         <td>Дата выполнения</td>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         currentData?.map((item, index) => (
//                             <tr key={index}>
//                                 <td>{params?.brigada?.find((i) => i?._id === item?.brigada)?.name || "Неизвестный"}</td>
//                                 <td>{params?.order?.find((i) => i?._id === item?.order)?.name || "Неизвестный"}</td>
//                                 <td>{moment(item.order_date, "DD-MM-YYYY HH:mm").format("DD.MM.YYYY")}</td>
//                                 <td>{params?.partiya?.find((i) => i?._id === item?.partiya)?.name || "Неизвестный"}</td>
//                                 <td>{params?.section?.find((i) => i?._id === item?.section)?.name || "Неизвестный"}</td>
//                                 <td>{params?.document?.find((i) => i?._id === item?.document)?.name || "Неизвестный"}</td>
//                                 <td>{params?.responsible?.find((i) => i?._id === item?.responsible)?.name || "Неизвестный"}</td>
//                                 <td>{moment(item.created_date, "YYYY-MM-DD").format("DD.MM.YYYY")}</td>
//                             </tr>
//                         ))
//                     }
//                 </tbody>
//             </Table>
//             <div className="pagination" >
//                 <Pagination
//                     current={currentPage}
//                     total={data.length}
//                     pageSize={itemsPerPage}
//                     onChange={handlePageChange}
//                 />
//             </div>
//         </div>
//     );
// };

// export default Report;
// Import dependencies
import React, { useState } from 'react';
import { useGetSoldProductsQuery } from '../../context/services/product.service';
import Table from '../../components/table/table';
import { useGetParametersQuery } from '../../context/services/parameters.service';
import moment from 'moment-timezone';
import { MdDelete } from 'react-icons/md';
import { Button, Pagination } from 'antd';
import { IoMdDownload } from 'react-icons/io';
import * as XLSX from 'xlsx';

const Report = () => {
    const { data = [] } = useGetSoldProductsQuery();
    const { data: params = [] } = useGetParametersQuery();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [filters, setFilters] = useState({
        brigada: "",
        order: "",
        partiya: "",
        section: "",
        document: "",
        responsible: "",
        order_date: "",
        created_date: "",
        min_quantity: "",
        max_quantity: "",
        min_density: "",
        max_density: "",
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const filteredData = data.filter((item) => {
        return Object.keys(filters).every((key) => {
            if (!filters[key]) return true;
            if (key === "order_date" || key === "created_date") {
                return moment(item[key], "YYYY-MM-DD").isSame(filters[key], "day");
            }
            if (key === "min_quantity") {
                return item.quantity >= Number(filters[key]);
            }
            if (key === "max_quantity") {
                return item.quantity <= Number(filters[key]);
            }
            if (key === "min_density") {
                return item.density >= Number(filters[key]);
            }
            if (key === "max_density") {
                return item.density <= Number(filters[key]);
            }
            return item[key] === filters[key];
        });
    });

    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columnMapping = {
        brigada: "Бригада",
        order: "Hoмep заказа",
        order_date: "Дата заказа",
        partiya: "Номер партии",
        section: "Подразделение",
        document: "Номер документа",
        responsible: "Ответственный",
        created_date: "Дата продажи",
        quantity: "Вес(кг)",
        density: "Плотность",
    };

    function mapIdsToNames() {
        return data.map(item => {
            const mappedItem = {};
            for (const key in item) {
                if (params[key]) {
                    const resource = params[key].find(r => r._id === item[key]);
                    const columnName = columnMapping[key] || key;
                    mappedItem[columnName] = resource ? resource.name || resource.number : item[key];
                } else if (key !== "_id" && key !== "__v") {
                    const columnName = columnMapping[key] || key;
                    mappedItem[columnName] = item[key];
                }
            }
            return mappedItem;
        });
    }

    function exportExcel() {
        const worksheet = XLSX.utils.json_to_sheet(mapIdsToNames());
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Продажи");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `продажи${moment().tz("Asia/Tashkent").format("DDMMYYYY")}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
let totalKg = 0;

currentData.forEach((item) => {
  totalKg += item.quantity;
});

    return (
      <div className="page">
        <div className="page_header">
          <h1>Продажи</h1>
          <div className="header_actions">
            <Button
              onClick={exportExcel}
              type="primary"
              style={{ background: "#26944a", margin: " 12px 0" }}
            >
              <IoMdDownload />
              Скачать Excel
            </Button>
          </div>
        </div>
        <Table>
          <thead>
            <tr>
              <td>
                <input
                  type="number"
                  placeholder="Мин вес"
                  value={filters.min_quantity}
                  onChange={(e) =>
                    handleFilterChange("min_quantity", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Макс вес"
                  value={filters.max_quantity}
                  onChange={(e) =>
                    handleFilterChange("max_quantity", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Мин плотность"
                  value={filters.min_density}
                  onChange={(e) =>
                    handleFilterChange("min_density", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Макс плотность"
                  value={filters.max_density}
                  onChange={(e) =>
                    handleFilterChange("max_density", e.target.value)
                  }
                />
              </td>
              {[
                "brigada",
                "order",
                "partiya",
                "section",
                "document",
                "responsible",
              ].map((filterKey) => (
                <td key={filterKey}>
                  <select
                    value={filters[filterKey]}
                    onChange={(e) =>
                      handleFilterChange(filterKey, e.target.value)
                    }
                  >
                    <option value="">Все</option>
                    {params[filterKey]?.map((param) => (
                      <option key={param._id} value={param._id}>
                        {param.name || param.number}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
              <td>
                <input
                  type="date"
                  value={filters.order_date}
                  onChange={(e) =>
                    handleFilterChange("order_date", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="date"
                  value={filters.created_date}
                  onChange={(e) =>
                    handleFilterChange("created_date", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>Вес( {totalKg}кг)</td>
              <td>Плотность</td>
              <td>Бригада</td>
              <td>Hoмep заказа</td>
              <td>Ответственный</td>
              <td>Номер партии</td>
              <td>Подразделение</td>
              <td>Номер документа</td>
              <td>Дата заказа</td>
              <td>Дата продажи</td>
            </tr>
          </thead>
          <tbody>
            {currentData?.map((item, index) => (
              <tr key={index}>
                <td>{item.quantity}</td>
                <td>{item.density}</td>
                <td>
                  {params?.brigada?.find((i) => i?._id === item?.brigada)
                    ?.name || "Неизвестный"}
                </td>
                <td>
                  {params?.order?.find((i) => i?._id === item?.order)?.name ||
                    "Неизвестный"}
                </td>
                <td>
                  {params?.responsible?.find(
                    (i) => i?._id === item?.responsible
                  )?.name || "Неизвестный"}
                </td>
                <td>
                  {params?.partiya?.find((i) => i?._id === item?.partiya)
                    ?.name || "Неизвестный"}
                </td>
                <td>
                  {params?.section?.find((i) => i?._id === item?.section)
                    ?.name || "Неизвестный"}
                </td>
                <td>
                  {params?.document?.find((i) => i?._id === item?.document)
                    ?.name || "Неизвестный"}
                </td>
                <td>
                  {moment(item.order_date, "DD-MM-YYYY HH:mm").format(
                    "DD.MM.YYYY"
                  )}
                </td>
                <td>
                  {moment(item.created_date, "YYYY-MM-DD").format("DD.MM.YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="pagination" style={{ marginTop: "12px" }}>
          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    );
};

export default Report;