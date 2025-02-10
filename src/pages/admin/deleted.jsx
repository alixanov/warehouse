import React from 'react';
import Table from '../../components/table/table';
import moment from 'moment-timezone';
import { useGetParametersQuery } from '../../context/services/parameters.service';
import { useGetDeletedQuery } from '../../context/services/product.service';

const Deleted = () => {
    const { data = [] } = useGetDeletedQuery()
    const { data: params = [] } = useGetParametersQuery()

    return (
        <div className='page'>
            <div className="page_header">
                <h1>Удаленные товары</h1>
            </div>
            <Table>
                <thead>
                    <tr>
                        <td>Бригада</td>
                        <td>Hoмep заказа</td>
                        <td>Дата заказа</td>
                        <td>Номер партии</td>
                        <td>Подразделение</td>
                        <td>Номер документа</td>
                        <td>Ответственный</td>
                        <td>Дата выполнения</td>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <span style={{ fontWeight: "bold", color: "#555" }}>Бригада:</span> 
                                {params?.brigada?.find((i) => i?._id === item?.brigada)?.name || "Неизвестный"}
                            </td>
                            <td>
                                <span style={{ fontWeight: "bold", color: "#555" }}>Номер заказа:</span> 
                                {params?.order?.find((i) => i?._id === item?.order)?.name || "Неизвестный"}
                            </td>
                            <td>
                                <span style={{ fontWeight: "bold", color: "#555" }}>Дата заказа:</span> 
                                {moment(item.order_date, "DD-MM-YYYY HH:mm").format("DD.MM.YYYY")}
                            </td>
                            <td>
                                <span style={{ fontWeight: "bold", color: "#555" }}>Номер партии:</span> 
                                {params?.partiya?.find((i) => i?._id === item?.partiya)?.name || "Неизвестный"}
                            </td>
                            <td>
                                <span style={{ fontWeight: "bold", color: "#555" }}>Подразделение:</span> 
                                {params?.section?.find((i) => i?._id === item?.section)?.name || "Неизвестный"}
                            </td>
                            <td>
                                <span style={{ fontWeight: "bold", color: "#555" }}>Номер документа:</span> 
                                {params?.document?.find((i) => i?._id === item?.document)?.name || "Неизвестный"}
                            </td>
                            <td>
                                <span style={{ fontWeight: "bold", color: "#555" }}>Ответственный:</span> 
                                {params?.responsible?.find((i) => i?._id === item?.responsible)?.name || "Неизвестный"}
                            </td>
                            <td>
                                <span style={{ fontWeight: "bold", color: "#555" }}>Дата выполнения:</span> 
                                {moment(item.created_date, "YYYY-MM-DD").format("DD.MM.YYYY")}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </Table>
        </div>
    );
};


export default Deleted;